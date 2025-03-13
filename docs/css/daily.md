### 1、纯css实现多行文本省略展示，省略号后跟随按钮，按钮可以展开/收起文本
![''](/images/cssImages/3.png)
![''](/images/cssImages/4.png)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    <style>
        .content {
            display: flex;
            width: 300px;
            border: 1px solid #ccc;
            padding: 12px;
        }
        .text::before{
            content: '';
            float: right;
            height: 100%;
            margin-bottom: -20px;
        }
        .btn {
            float: right;
            clear: both;
            margin-right: 8px;
            color: #3a5ccc;
        }
        .text {
            display: -webkit-box;
            overflow: hidden;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
        }
        #exp {
            visibility: hidden;
        }
        #exp:checked+.text{
            -webkit-line-clamp: 999; /*设置一个足够大的行数就可以了*/
        }
        .btn::after{
            content:'展开'
        }
        #exp:checked+.text .btn::after{
            content:'收起'
        }
    </style>
</head>
<body>
<div class="content">
    <input type="checkbox" id="exp" />
    <div class="text">
        <label class="btn" for="exp"></label>
        <span>
            但听得蹄声如雷，十余乘马疾风般卷上山来。马上乘客一色都是玄色薄毡大氅，
            里面玄色布衣，但见人似虎，马如龙，人既矫捷，马亦雄骏，每一匹马都是高头
            长腿，通体黑毛，奔到近处，群雄眼前一亮，金光闪闪，却见每匹马的蹄铁竟然
            是黄金打就。来者一共是一十九骑，人数虽不甚多，气势之壮，却似有如千军万
            马一般，前面一十八骑奔到近处，拉马向两旁一分，最后一骑从中驰出
        </span>
    </div>
</div>
</body>
</html>
```