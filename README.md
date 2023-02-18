# 記帳本

此專案提供註冊會員使用專屬的記帳本，使用者可以新增刪除修改，更能夠搜尋類別查詢各類別支出

## 功能說明

* 使用者可以點選個消費查看其詳細資訊，例如：日期金額等等。
* 使用者可以使用搜尋類別查詢各類別支出
* 使用者可以新增/刪除/修改各個紀錄
* 使用者可以註冊會員且登入使用個人記帳本，並且提供Facebook授權及登入

## 安裝方式

1.開啟terminal並且clone此專案至本機電腦
```
git clone https://github.com/Shiba-Patrick/expense-tracker.git
```
2.輸入cd指令找到存放專案的資料夾，並輸入其名稱
```
cd expense-tracker
```
3.安裝npm套件
```
npm install
```
4.新增.env並根據.env.example資訊來設定環境變數
```
5.建立種子資料，如在終端機中顯示done，即表示建立成功
```
npm run seed
```
6.使用nodemon來執行app.js
```
npm run dev
```
7.成功顯示字串:伺服器順利啟動
```
App is listening on http://localhost:3000
```
現在！您可以開啟任一瀏覽器輸入　
```
http://localhost:3000
```
開始試用此餐廳清單了喔！
```
## 開發工具
```
* Node.js
* Express:4.17.1
* Express-handlebars:4.0.2
* body-parser:1.20.1
* mongoose:5.7
* method-override:3.0.0
* dotenv:16.0.3 
* express-session 1.17.1
* bcrypt 2.4.3
* passport 0.4.1
* passport-local 1.0.0
* passport-facebook 3.0.0
* connect-flash 0.1.1
