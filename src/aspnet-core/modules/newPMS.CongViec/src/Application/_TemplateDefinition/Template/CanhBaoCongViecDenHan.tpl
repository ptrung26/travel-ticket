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
      .link {
        background: #2f9dd7;
        border-radius: 3px;
        color: #ffffff !important;
        font-weight: normal;
        text-decoration: none;
        text-transform: none;
        padding: 10px 20px;
        display: block;
        width: fit-content;
        margin: 20px auto 0;
        cursor: pointer;
      }

       .title-top {
          font-size: 20px;
          font-weight: 600;
          line-height: 32px;
          color: #ED1C24;
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
         <img src="{{model.logo}}" alt="logo" />
      </div>
       <h1>
       <span class="title-bottom"> Đại học Y Dược Thành Phố Hồ Chí Minh </span> <br />
        <span class="title-top">Trung Tâm Kiểm Chuẩn Chất Lượng <br /> Xét Nghiệm Y Học </span> 
      </h1>
      <p>Xin chào <b>{{model.ho_ten}}</b></p>
      <p>Công việc: <b>{{model.ten}}</b> {{model.message_thong_bao_den_han}}, vui lòng kiểm tra và thực hiện ngay</p>  
    
      
    </div>
  </body>
</html>

