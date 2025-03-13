### 1、:focus-within伪类
表示当元素或其任意后代元素被聚焦时，将匹配该元素
![''](/images/cssImages/1.png)

### 2、::first-letter伪元素
表示将样式应用于区块容器第一行的第一个字母，但仅当其前面没有其他内容（例如图像或行内表格）时才有效。
![''](/images/cssImages/2.png)

### 3、::selection伪元素
表示文档中被用户高亮的部分
```css
p::selection {
    background: #ff0000;
}
```