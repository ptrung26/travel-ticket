<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta charset="utf-8" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
      rel="stylesheet"
    />
    <style>
      * {
        font-family: "Roboto", sans-serif;
        margin: 0;
        padding: 0;
        font-size: 16px;
        line-height: 22px;
        color: #555;
        min-height: 22px;
      }

      .box {
        max-width: 589px;
        width: 100%;
        border: #dddddd solid 1px;
        border-top: #2f9dd7 solid 5px;
        background-color: #fff;
        padding: 30px 25px;
        margin: 0 auto;
      }
      .img {
        text-align: center;
        padding: 20px 0;
      }

      .img img {
          max-width: 100px;
      }

      h1 {
        font-size: 18px;
        font-weight: bold;
        line-height: 1.5;
        text-align: center;
        color: #555;
        margin-bottom: 30px;
      }

      .title-top {
          font-size: 20px;
          font-weight: 600;
          line-height: 32px;
           color: #ED1C24 !important;
          text-transform: uppercase;
      }

      .title-bottom {
         font-size: 20px;
         font-weight: 700;
         line-height: 32px;
         color: #255586;
         text-transform: uppercase;
      }
     
    </style>
  </head>

  <body>
    <div class="box">
      <div class="img">
       
      </div>
       <h1>
       <span class="title-bottom"> MTravel - Vi vu đi muôn nơi </span> <br />
      </h1>
      <h3>Chi tiêt booking: {{tenTour}} - Mã: {{ma}}
        <p>Xin chào Quý Khách,</p>
        <p>
            Chúng tôi xin xác nhận rằng booking tour của quý khách đã được huỷ thành công.
        </p>
        <p>
            {{message}}. Quá trình hoàn tiền có thể mất từ 7-10 ngày làm việc.
        </p>
        <p>
            Chúng tôi xin lỗi vì sự bất tiện này và mong rằng sẽ có cơ hội phục vụ quý khách trong tương lai.
        </p>
        <p>
            Trân trọng,<br />
            Đội ngũ MTravel
        </p>
    </div>
  </body>
</html>

