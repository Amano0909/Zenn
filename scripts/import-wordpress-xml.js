const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const EXPORT_DIR = path.join(ROOT, "export");
const XML_PATH = path.join(EXPORT_DIR, "WordPress.2026-03-15.xml");
const UPLOADS_DIR = path.join(EXPORT_DIR, "uploads");
const ARTICLES_DIR = path.join(ROOT, "articles");
const IMAGES_DIR = path.join(ROOT, "images");
const TITLE_OVERRIDES = new Map([
  [
    "Jamf ProとEntra IDと利用してデバイスコンプライアンスを構成する際に登録がうまくいかない対処法（リダイレクトがうまくいかない問題）",
    "Jamf ProとEntra IDでデバイスコンプライアンス登録がうまくいかない対処法",
  ],
]);
const VALID_IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp"]);
const VOID_TAGS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
const BLOCK_TAGS = new Set([
  "article",
  "aside",
  "blockquote",
  "div",
  "figure",
  "figcaption",
  "footer",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "tbody",
  "thead",
  "tfoot",
  "tr",
  "td",
  "th",
  "ul",
]);

main();

function main() {
  ensureExists(XML_PATH, "WordPress XML");
  ensureExists(UPLOADS_DIR, "uploads directory");

  const xml = fs.readFileSync(XML_PATH, "utf8");
  const uploadsIndex = buildUploadsIndex(UPLOADS_DIR);
  const posts = parsePosts(xml);

  const generatedSlugs = new Set();
  const imageReport = [];

  resetGeneratedContent(posts);

  for (const post of posts) {
    const articleContext = createArticleContext(post.slug, uploadsIndex);
    const markdownBody = convertContentToMarkdown(post.content, articleContext);
    const frontMatter = buildFrontMatter(post);
    const articlePath = path.join(ARTICLES_DIR, `${post.slug}.md`);
    fs.writeFileSync(articlePath, `${frontMatter}\n${markdownBody.trim()}\n`, "utf8");
    copyArticleImages(articleContext, imageReport);
    generatedSlugs.add(post.slug);
  }

  const oversizedImages = findOversizedImages(IMAGES_DIR);
  const summary = {
    generatedArticles: posts.length,
    generatedSlugs: Array.from(generatedSlugs).sort(),
    copiedImages: imageReport.length,
    missingImages: imageReport.filter((entry) => entry.status === "missing"),
    oversizedImages,
  };

  console.log(JSON.stringify(summary, null, 2));
}

function ensureExists(targetPath, label) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`${label} not found: ${targetPath}`);
  }
}

function resetGeneratedContent(posts) {
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  for (const entry of fs.readdirSync(ARTICLES_DIR, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== ".keep") {
      fs.rmSync(path.join(ARTICLES_DIR, entry.name), { force: true });
    }
  }

  for (const entry of fs.readdirSync(IMAGES_DIR, { withFileTypes: true })) {
    const fullPath = path.join(IMAGES_DIR, entry.name);
    if (entry.isDirectory()) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  }
}

function buildUploadsIndex(uploadsDir) {
  const byRelativePath = new Map();
  const byBasename = new Map();

  walkFiles(uploadsDir, (filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    if (!VALID_IMAGE_EXTENSIONS.has(extension)) {
      return;
    }

    const relativePath = toPosix(path.relative(uploadsDir, filePath));
    const basename = path.basename(filePath).toLowerCase();
    byRelativePath.set(relativePath.toLowerCase(), filePath);

    const matches = byBasename.get(basename) || [];
    matches.push(filePath);
    byBasename.set(basename, matches);
  });

  return { byRelativePath, byBasename };
}

function walkFiles(dirPath, visit) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, visit);
      continue;
    }
    if (entry.isFile()) {
      visit(fullPath);
    }
  }
}

function parsePosts(xml) {
  const rawItems = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g), (match) => match[1]);
  const slugCounts = new Map();
  const posts = [];

  for (const rawItem of rawItems) {
    const postType = extractTagValue(rawItem, "wp:post_type");
    const status = extractTagValue(rawItem, "wp:status");

    if (postType !== "post" || status !== "publish") {
      continue;
    }

    const rawSlug = extractTagValue(rawItem, "wp:post_name");
    const title = normalizeTitle(extractTagValue(rawItem, "title"));
    const content = extractTagValue(rawItem, "content:encoded") || "";
    const categories = extractCategories(rawItem);
    const topics = buildTopics(categories);
    const slug = buildUniqueSlug(rawSlug || title || "wordpress-post", slugCounts);

    posts.push({
      title,
      slug,
      content,
      topics,
    });
  }

  return posts;
}

function extractTagValue(rawItem, tagName) {
  const escapedTag = escapeRegExp(tagName);
  const cdataPattern = new RegExp(`<${escapedTag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${escapedTag}>`);
  const plainPattern = new RegExp(`<${escapedTag}>([\\s\\S]*?)<\\/${escapedTag}>`);
  const cdataMatch = rawItem.match(cdataPattern);
  if (cdataMatch) {
    return cdataMatch[1];
  }
  const plainMatch = rawItem.match(plainPattern);
  return plainMatch ? decodeEntities(plainMatch[1].trim()) : "";
}

function extractCategories(rawItem) {
  const categories = [];
  const categoryPattern = /<category\s+domain="([^"]+)"\s+nicename="([^"]*)"><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g;
  for (const match of rawItem.matchAll(categoryPattern)) {
    categories.push({
      domain: match[1],
      nicename: match[2],
      label: match[3],
    });
  }
  return categories;
}

function buildTopics(categories) {
  const candidates = [];
  for (const category of categories) {
    if (category.domain !== "category" && category.domain !== "post_tag") {
      continue;
    }
    const topic = sanitizeTopic(category.nicename || category.label);
    if (topic) {
      candidates.push(topic);
    }
  }
  return Array.from(new Set(candidates)).slice(0, 5);
}

function sanitizeTopic(input) {
  const topic = String(input || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (/^[0-9a-f-]{12,}$/.test(topic)) {
    return "";
  }
  return topic;
}

function buildUniqueSlug(rawSlug, slugCounts) {
  let slug = sanitizeSlug(rawSlug);
  if (slug.length < 12) {
    slug = `${slug}-memo`.replace(/-+/g, "-");
  }
  if (slug.length < 12) {
    slug = `${slug}-post`.replace(/-+/g, "-");
  }
  if (slug.length > 50) {
    slug = slug.slice(0, 50).replace(/-+$/g, "");
  }
  if (slug.length < 12) {
    slug = `${slug}entry`.slice(0, 12);
  }

  const count = slugCounts.get(slug) || 0;
  slugCounts.set(slug, count + 1);
  if (count === 0) {
    return slug;
  }

  const suffix = `-${count + 1}`;
  const maxBaseLength = 50 - suffix.length;
  return `${slug.slice(0, maxBaseLength).replace(/-+$/g, "")}${suffix}`;
}

function sanitizeSlug(input) {
  return String(input || "wordpress-post")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildFrontMatter(post) {
  const topics = post.topics.length > 0 ? post.topics.map((topic) => JSON.stringify(topic)).join(", ") : "";
  return [
    "---",
    `title: ${JSON.stringify(post.title || post.slug)}`,
    'emoji: "📝"',
    'type: "tech"',
    `topics: [${topics}]`,
    "published: false",
    "---",
    "",
  ].join("\n");
}

function normalizeTitle(title) {
  const overridden = TITLE_OVERRIDES.get(title) || title;
  return overridden;
}

function createArticleContext(slug, uploadsIndex) {
  return {
    slug,
    uploadsIndex,
    imageMap: new Map(),
    imageCounter: 0,
    copies: [],
  };
}

function convertContentToMarkdown(html, articleContext) {
  const tree = parseHtmlFragment(html.replace(/\r\n/g, "\n"));
  const markdown = renderBlockNodes(tree.children, articleContext);
  return cleanupMarkdown(markdown);
}

function parseHtmlFragment(html) {
  const root = createElementNode("root", {});
  const stack = [root];
  const tokenPattern = /<!--[\s\S]*?-->|<\/?[A-Za-z0-9:-]+(?:\s+[^<>]*?)?>/g;
  let lastIndex = 0;

  for (const match of html.matchAll(tokenPattern)) {
    const token = match[0];
    const text = html.slice(lastIndex, match.index);
    if (text) {
      stack[stack.length - 1].children.push({ type: "text", value: text });
    }
    lastIndex = match.index + token.length;

    if (token.startsWith("<!--")) {
      continue;
    }

    const isClosing = /^<\//.test(token);
    const tagMatch = token.match(/^<\/?\s*([A-Za-z0-9:-]+)/);
    if (!tagMatch) {
      continue;
    }

    const tagName = tagMatch[1].toLowerCase();
    if (isClosing) {
      while (stack.length > 1) {
        const current = stack.pop();
        if (current.tagName === tagName) {
          break;
        }
      }
      continue;
    }

    const attributes = parseAttributes(token);
    const node = createElementNode(tagName, attributes);
    stack[stack.length - 1].children.push(node);

    const selfClosing = /\/>$/.test(token) || VOID_TAGS.has(tagName);
    if (!selfClosing) {
      stack.push(node);
    }
  }

  const remaining = html.slice(lastIndex);
  if (remaining) {
    stack[stack.length - 1].children.push({ type: "text", value: remaining });
  }

  return root;
}

function createElementNode(tagName, attributes) {
  return {
    type: "element",
    tagName,
    attributes,
    children: [],
  };
}

function parseAttributes(tagToken) {
  const attributes = {};
  const attributePattern = /([A-Za-z_:][-A-Za-z0-9_:.]*)(?:=("([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let first = true;
  for (const match of tagToken.matchAll(attributePattern)) {
    if (first) {
      first = false;
      continue;
    }
    const name = match[1].toLowerCase();
    const rawValue = match[3] ?? match[4] ?? match[5] ?? "";
    attributes[name] = decodeEntities(rawValue);
  }
  return attributes;
}

function renderBlockNodes(nodes, articleContext) {
  let output = "";
  for (const node of nodes) {
    output += renderBlockNode(node, articleContext);
  }
  return output;
}

function renderBlockNode(node, articleContext, listDepth = 0) {
  if (node.type === "text") {
    const text = normalizeLooseText(node.value);
    return text ? `${text}\n\n` : "";
  }

  switch (node.tagName) {
    case "p": {
      const paragraph = renderInlineNodes(node.children, articleContext).trim();
      return paragraph ? `${paragraph}\n\n` : "";
    }
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6": {
      const level = Math.max(2, Number(node.tagName.slice(1)) || 2);
      const heading = renderInlineNodes(node.children, articleContext).trim();
      return heading ? `${"#".repeat(level)} ${heading}\n\n` : "";
    }
    case "ul":
      return renderList(node, articleContext, false, listDepth);
    case "ol":
      return renderList(node, articleContext, true, listDepth);
    case "blockquote": {
      const quote = cleanupMarkdown(renderBlockNodes(node.children, articleContext)).trim();
      if (!quote) {
        return "";
      }
      const prefixed = quote
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"))
        .join("\n");
      return `${prefixed}\n\n`;
    }
    case "pre":
      return renderCodeBlock(node);
    case "figure":
      return renderFigure(node, articleContext);
    case "img": {
      const image = renderImage(node, articleContext);
      return image ? `${image}\n\n` : "";
    }
    case "table":
      return renderTable(node, articleContext);
    case "div": {
      if ((node.attributes.class || "").includes("wp-block-embed__wrapper")) {
        const text = normalizeLooseText(extractText(node, articleContext));
        return text ? `${text}\n\n` : "";
      }
      return renderBlockNodes(node.children, articleContext);
    }
    case "iframe": {
      const src = node.attributes.src || "";
      return src ? `${src}\n\n` : "";
    }
    case "hr":
      return "---\n\n";
    case "br":
      return "  \n";
    case "code":
      return `\`${extractText(node, articleContext).trim()}\``;
    default: {
      if (BLOCK_TAGS.has(node.tagName)) {
        return renderBlockNodes(node.children, articleContext);
      }
      const inline = renderInlineNodes([node], articleContext).trim();
      return inline ? `${inline}\n\n` : "";
    }
  }
}

function renderInlineNodes(nodes, articleContext) {
  return nodes.map((node) => renderInlineNode(node, articleContext)).join("");
}

function renderInlineNode(node, articleContext) {
  if (node.type === "text") {
    return decodeEntities(node.value).replace(/\s+/g, " ");
  }

  switch (node.tagName) {
    case "strong":
    case "b": {
      const text = renderInlineNodes(node.children, articleContext).trim();
      return text ? `**${text}**` : "";
    }
    case "em":
    case "i": {
      const text = renderInlineNodes(node.children, articleContext).trim();
      return text ? `*${text}*` : "";
    }
    case "code": {
      const text = extractText(node, articleContext).trim();
      return text ? `\`${text}\`` : "";
    }
    case "br":
      return "  \n";
    case "a": {
      const href = node.attributes.href || "";
      const imageChild = node.children.find((child) => child.type === "element" && child.tagName === "img");
      if (imageChild) {
        return renderImage(imageChild, articleContext);
      }
      const text = renderInlineNodes(node.children, articleContext).trim();
      if (!href) {
        return text;
      }
      if (!text || text === href) {
        return href;
      }
      return `[${text}](${href})`;
    }
    case "img":
      return renderImage(node, articleContext);
    default:
      return renderInlineNodes(node.children, articleContext);
  }
}

function renderList(node, articleContext, ordered, listDepth) {
  const items = node.children.filter((child) => child.type === "element" && child.tagName === "li");
  if (items.length === 0) {
    return "";
  }

  let output = "";
  items.forEach((item, index) => {
    const prefix = ordered ? `${index + 1}. ` : "- ";
    const inlineChildren = [];
    const nestedLists = [];

    for (const child of item.children) {
      if (child.type === "element" && (child.tagName === "ul" || child.tagName === "ol")) {
        nestedLists.push(child);
      } else {
        inlineChildren.push(child);
      }
    }

    let itemText = cleanupMarkdown(renderBlockNodes(inlineChildren, articleContext)).trim();
    if (!itemText) {
      itemText = renderInlineNodes(inlineChildren, articleContext).trim();
    }

    const indent = "  ".repeat(listDepth);
    if (itemText) {
      const lines = itemText.split("\n");
      output += `${indent}${prefix}${lines[0]}\n`;
      for (const line of lines.slice(1)) {
        output += `${indent}${" ".repeat(prefix.length)}${line}\n`;
      }
    } else {
      output += `${indent}${prefix}\n`;
    }

    for (const nested of nestedLists) {
      output += renderList(nested, articleContext, nested.tagName === "ol", listDepth + 1);
    }
  });

  return `${output}\n`;
}

function renderFigure(node, articleContext) {
  const className = node.attributes.class || "";
  if (className.includes("wp-block-embed")) {
    const embedded = normalizeLooseText(extractText(node, articleContext));
    return embedded ? `${embedded}\n\n` : "";
  }

  const imageNode = findFirstChild(node, "img");
  if (imageNode) {
    const image = renderImage(imageNode, articleContext);
    const captionNode = findFirstChild(node, "figcaption");
    const caption = captionNode ? renderInlineNodes(captionNode.children, articleContext).trim() : "";
    if (caption) {
      return `${image}\n*${caption}*\n\n`;
    }
    return image ? `${image}\n\n` : "";
  }

  return renderBlockNodes(node.children, articleContext);
}

function renderImage(node, articleContext) {
  const source = node.attributes.src || "";
  if (!source) {
    return "";
  }

  const alt = (node.attributes.alt || "").trim();
  const mappedSource = mapImageSource(source, articleContext);
  return `![${escapeMarkdownText(alt)}](${mappedSource})`;
}

function renderTable(node, articleContext) {
  const rows = collectTableRows(node, articleContext);
  if (rows.length === 0) {
    return "";
  }

  const normalizedRows = rows.map((row) => row.map((cell) => cell.replace(/\|/g, "\\|").trim()));
  const header = normalizedRows[0];
  const divider = header.map(() => "---");
  const bodyRows = normalizedRows.slice(1);
  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${divider.join(" | ")} |`,
    ...bodyRows.map((row) => `| ${row.join(" | ")} |`),
  ];
  return `${lines.join("\n")}\n\n`;
}

function collectTableRows(node, articleContext) {
  const rows = [];
  const rowNodes = findChildren(node, "tr");
  for (const rowNode of rowNodes) {
    const cells = rowNode.children.filter((child) => child.type === "element" && (child.tagName === "th" || child.tagName === "td"));
    if (cells.length === 0) {
      continue;
    }
    rows.push(cells.map((cell) => normalizeLooseText(extractText(cell, articleContext))));
  }
  return rows;
}

function renderCodeBlock(node) {
  const language = detectCodeLanguage(node);
  const contentNode = findFirstChild(node, "code") || node;
  const code = decodeEntities(extractRawText(contentNode)).replace(/\n+$/g, "");
  return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
}

function detectCodeLanguage(node) {
  const classNames = [node.attributes.class || ""];
  const codeNode = findFirstChild(node, "code");
  if (codeNode) {
    classNames.push(codeNode.attributes.class || "");
  }
  const combined = classNames.join(" ");
  const match = combined.match(/(?:lang|language)-([A-Za-z0-9_+-]+)/);
  return match ? match[1].toLowerCase() : "";
}

function findFirstChild(node, tagName) {
  for (const child of node.children || []) {
    if (child.type === "element" && child.tagName === tagName) {
      return child;
    }
    if (child.type === "element") {
      const nested = findFirstChild(child, tagName);
      if (nested) {
        return nested;
      }
    }
  }
  return null;
}

function findChildren(node, tagName) {
  const matches = [];
  for (const child of node.children || []) {
    if (child.type === "element" && child.tagName === tagName) {
      matches.push(child);
    }
    if (child.type === "element") {
      matches.push(...findChildren(child, tagName));
    }
  }
  return matches;
}

function extractText(node, articleContext) {
  if (node.type === "text") {
    return decodeEntities(node.value);
  }
  if (node.tagName === "img") {
    return renderImage(node, articleContext);
  }
  return (node.children || []).map((child) => extractText(child, articleContext)).join("");
}

function extractRawText(node) {
  if (node.type === "text") {
    return node.value;
  }
  return (node.children || []).map((child) => extractRawText(child)).join("");
}

function mapImageSource(source, articleContext) {
  if (!/^https?:\/\//i.test(source)) {
    return source;
  }

  if (articleContext.imageMap.has(source)) {
    return articleContext.imageMap.get(source).markdownPath;
  }

  const resolved = resolveUploadFile(source, articleContext.uploadsIndex);
  const extension = path.extname(resolved?.filePath || source).toLowerCase() || ".png";
  articleContext.imageCounter += 1;
  const fileName = `image-${String(articleContext.imageCounter).padStart(2, "0")}${extension}`;
  const destinationDirectory = path.join(IMAGES_DIR, articleContext.slug);
  const destinationPath = path.join(destinationDirectory, fileName);
  const markdownPath = toPosix(path.join("/images", articleContext.slug, fileName));

  const mapping = {
    source,
    filePath: resolved?.filePath || null,
    destinationPath,
    markdownPath,
  };
  articleContext.imageMap.set(source, mapping);
  articleContext.copies.push(mapping);
  return markdownPath;
}

function resolveUploadFile(sourceUrl, uploadsIndex) {
  let url;
  try {
    url = new URL(sourceUrl);
  } catch {
    return null;
  }

  const uploadIndex = url.pathname.indexOf("/wp-content/uploads/");
  if (uploadIndex === -1) {
    return null;
  }

  const relativePath = decodeURIComponent(url.pathname.slice(uploadIndex + "/wp-content/uploads/".length)).replace(/^\/+/, "");
  const normalizedRelativePath = relativePath.toLowerCase();
  if (uploadsIndex.byRelativePath.has(normalizedRelativePath)) {
    return {
      relativePath,
      filePath: uploadsIndex.byRelativePath.get(normalizedRelativePath),
    };
  }

  const basename = path.basename(relativePath).toLowerCase();
  const basenameMatches = uploadsIndex.byBasename.get(basename) || [];
  if (basenameMatches.length === 1) {
    return {
      relativePath,
      filePath: basenameMatches[0],
    };
  }

  return null;
}

function copyArticleImages(articleContext, imageReport) {
  if (articleContext.copies.length === 0) {
    return;
  }

  const destinationDirectory = path.join(IMAGES_DIR, articleContext.slug);
  fs.mkdirSync(destinationDirectory, { recursive: true });

  for (const copy of articleContext.copies) {
    if (!copy.filePath || !fs.existsSync(copy.filePath)) {
      imageReport.push({
        slug: articleContext.slug,
        source: copy.source,
        destination: copy.markdownPath,
        status: "missing",
      });
      continue;
    }

    fs.copyFileSync(copy.filePath, copy.destinationPath);
    imageReport.push({
      slug: articleContext.slug,
      source: copy.source,
      destination: copy.markdownPath,
      status: "copied",
    });
  }
}

function findOversizedImages(imagesDir) {
  const oversized = [];
  if (!fs.existsSync(imagesDir)) {
    return oversized;
  }

  walkFiles(imagesDir, (filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    if (!VALID_IMAGE_EXTENSIONS.has(extension)) {
      return;
    }
    const stat = fs.statSync(filePath);
    if (stat.size > 3 * 1024 * 1024) {
      oversized.push({
        path: filePath,
        size: stat.size,
      });
    }
  });

  return oversized;
}

function normalizeLooseText(text) {
  return decodeEntities(text)
    .replace(/\r\n/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cleanupMarkdown(markdown) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\n+$/g, "\n")
    .trim();
}

function decodeEntities(text) {
  return String(text || "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeMarkdownText(text) {
  return String(text || "").replace(/[\[\]]/g, "\\$&");
}

function escapeRegExp(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toPosix(targetPath) {
  return targetPath.split(path.sep).join("/");
}
