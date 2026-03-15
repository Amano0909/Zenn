---
title: "Windows PEで作るデータ削除USB(Cipher＆diskpart)"
emoji: "📝"
type: "tech"
topics: ["cipher", "diskpart", "technology", "windows-pe"]
published: false
---

PC廃棄のときに必ずやらなければ行けない作業ありますよね。

そうデータ削除作業。データ削除は論理的にしてもいいし、物理的に壊してもいいですが今回共有できればと思っているのは「論理削除」時に使用するUSBの作り方になります。

Windows PE、Cipher、diskpartをこの3つを利用してデータ削除を行います。

https://amano-yuruyuru.com/pc-disposal

今回作業に当たり、下記を参考にさせていただきました。感謝します。

[Windows PEとバッチファイルでデータ消去USBを作成](https://blacksheepnote.blogspot.com/2019/07/windows-peusb.html)

## Windows PE、Cipher、diskpartについて

Windows PEとは？

「Windows Preinstallation Environment」の略になります。Microsoftが無料で配布しているツールになります。簡単にいいますと、軽量のWindows OS です。Windows もどきといいますか・・

データのリカバリーやコピー、またPC のマスターイメージの取得や戻し等、限定した操作をする為の用途として使われます。

Cipherとは？

コマンド・プロンプト上で使用できるWindows OSのツールになります。

試しに「

cipher /?

」と打ってヘルプを確認してみてください。

![](/images/data-deletion-windowspe/image-01.png)

/w オプションを付けて実行すると、cipherは、ディスクの空き領域いっぱいになるように書き込みを始めます。最初の1回はオール0、次はオール1、そして最後にランダムなデータを書き込みます。計3回。消去が必要なセクタに上書きを行うことでデータの復元を不可能にします。

WindowsPEには実装されていないので、CipherをPE側に別途導入する必要があります。元のファイル場所は「C:\Windows\System32\cipher.exe」になります。

diskpartとは？

「対話形式でハードディスクのあれこれを操作するときに使うコマンド」と覚えていただければと思います。パーティションを作成したり、フォーマットしたり、データを削除したり。

今回使う主に使うコマンドは「

clean all

」になります。ディスクの内容を全部削除し、すべてのセクタに0を書き込みます。

diskpartはWindows PEに実装されているので別途導入の必要はありません。

## Windows PE の導入とUSB作成

1 「

Windows ADK」と「Windows PE アドオン (ADK 用)」をPCにインストールします。ダウンロードは[ここ](https://docs.microsoft.com/ja-jp/windows-hardware/get-started/adk-install#winADK)から行ってください。インストールは基本的にはデフォルトのままで大丈夫です。

![](/images/data-deletion-windowspe/image-02.png)

2 「展開およびイメージング ツール環境」を

**管理者権限で**

起動します。スタートメニュー→Windows Kits内にあります。右クリックし「その他」→「管理者として実行」で起動してください。

3　WindowsPEの元となるファイルのコピーを下記のコマンドで行います。詳細はMicrosoftの

[この](https://docs.microsoft.com/ja-jp/windows-hardware/manufacture/desktop/copype-command-line-options)

ページを参照。

```plane
copype amd64 C:\WinPE_amd64
```

4 下記のコマンドでWindowsPEのブートイメージをマウントします。この操作をすることで，「C:\WinPE_amd64\mount\」内に「Program Files」「 Program Files(x86)」「 ProgramData」 「Windows」「 ユーザー」の5つのフォルダが作成されます。

```plane
Dism /Mount-Image /ImageFile:"C:\WinPE_amd64\media\sources\boot.wim" /index:1 /MountDir:"C:\WinPE_amd64\mount"
```

5 エクスプローラーでの作業になります。

「C:\WinPE_amd64\mount\Windows\

System32

」内に作成した3つのファイルと

cipher.exeをコピーしてください。※ファイルは「バッチファイル群」を参照。

6 アンマウントを下記のコマンドで行います。

```plane
Dism /unmount-image /mountdir:C:\WinPE_amd64\mount\ /commit
```

ExplorerなどWindowsPEの作業に関係するプログラムは必ず閉じてから以下のコマンドを実行してください。

7 USBメモリ等にWindowsPEの内容をコピーします。

```plane
MakeWinPEMedia /UFD C:\WinPE_amd64 D:
```

D:の部分は各自環境によって変更してください。書き込むUSBのドライブ名になります。USBのデータはすべて削除されますのでご注意ください

これでUSBの作成は完了になります。作成したUSBからBootを行うことでWindows PEが立ち上がり自動でバッチが走るかと思います。

## バッチファイル群

```plane
select disk 0
clean all
create partition primary
assign letter=Q
format fs=ntfs quick
exit
```

```plane
@echo off
setlocal enableDelayedExpansion

echo HDD Wipe OK?(yes:y no:n)

set /p HIT=

if "%HIT%"=="y" (
  echo;
  echo diskpart start %date% %time%
  diskpart /s wipe_diskpart.txt
  echo;
  echo diskpart complete !date! !time!
  echo;
  echo cipher start !date! !time!
  cipher /w:q:
  echo;
  echo cipher complete !date! !time!
) else (
  goto END
)

:END
echo hit any key .....
pause > nul
wpeutil shutdown
```

```plane
wpeinit
start wipe_hdd.bat
```

## 終わりに

今回作成したデータ削除USBはWindows でもMacでも使えます。いちいちSecure bootを切る必要もありませんし、UEFIで起動するので非常に便利かなと思ってます。

私自身Windows PEの存在を知ったのはつい最近でもっと早く知っていれば・・・・いままの作業がもっと効率的に行えたんではないかなと後悔が笑

ちなみに知るきっかけになったのは情シスSlackというコミュニティです。宣伝させてください。

https://note.com/ringo_o_7/n/nd72d772b83f1

強強のエンジニア方ばかりであまり、恐れ多くて発言やGiveはできていませんがなにかコミュニティに返せればなと日々思っています。ROM専すみません笑

それでは＼(^o^)／
