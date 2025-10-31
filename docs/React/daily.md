## dev daily

### **1、canvas 实现视频截图**
实现效果
![''](/images/reactImages/img1.png)

代码开箱即用：
```tsx
import React, { useRef, useState } from 'react';
import { AndroidOutlined, AppleOutlined, LikeOutlined, ScissorOutlined } from '@ant-design/icons';
import { Button, Card, Tabs, Image } from 'antd';
import './index.scss';

const videoList = [
  {
    id: 1,
    name: '苹果视频',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    icon: AppleOutlined,
  },
  {
    id: 2,
    name: '安卓视频',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    icon: AndroidOutlined,
  },
];

const TabsComp: React.FC<{ onTabChange: (key: string) => void }> = ({ onTabChange }) => {
  return (
    <Tabs
      defaultActiveKey="1"
      onChange={onTabChange}
      items={videoList.map((videoItem) => {
        const { id, icon: Icon, name } = videoItem;
        return {
          key: String(id),
          label: name,
          icon: <Icon />,
        };
      })}
    />
  );
};

export default function CaptureOfVideo() {
  const [activeKey, setActiveKey] = useState('1');
  const [capturedImage, setCapturedImage] = useState<{
    dataUrl: string;
    blob: Blob | null;
    width: number;
    height: number;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideoInfo = videoList.find((item) => item.id === Number(activeKey));
  const handleTabChange = (key: string) => {
    setActiveKey(key);
    setCapturedImage(null);
  };
  const onCapturePicture = async () => {
    try {
      const videoElement = videoRef.current;

      if (!videoElement) {
        throw new Error('未找到视频元素');
      }

      // 创建 canvas 元素
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 设置 canvas 尺寸与视频一致
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // 将当前视频帧绘制到 canvas 上
      ctx?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      // 转换为图片数据
      const imageData = canvas.toDataURL('image/jpeg', 0.8);

      // 或者转换为 Blob 对象
      const imageBlob: Blob | null = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.8,
        );
      });

      setCapturedImage({
        dataUrl: imageData,
        blob: imageBlob,
        width: canvas.width,
        height: canvas.height,
      });
      console.log(capturedImage, 'capturedImage');
    } catch (error) {
      console.error('截取视频帧失败:', error);
      throw error;
    }
  };

  return (
    <>
      <TabsComp onTabChange={handleTabChange} />

      <Card
        title={currentVideoInfo?.name}
        extra={
          <Button
            color="green"
            variant="solid"
            type={'primary'}
            icon={<ScissorOutlined />}
            onClick={onCapturePicture}
          >
            捕获
          </Button>
        }
        className={'video-content-box'}
      >
        <div className={'video-item'}>
          <video
            ref={videoRef}
            key={currentVideoInfo?.id}
            className={'play-video'}
            width="100%"
            height="100%"
            crossOrigin="anonymous"
            controls
            autoPlay
            style={{ borderRadius: '4px', objectFit: 'cover' }}
          >
            <source src={currentVideoInfo?.url} type="video/mp4" />
          </video>
        </div>

        <div className="capture-pic-box">
          {capturedImage?.dataUrl ? (
            <Image src={capturedImage?.dataUrl} style={{ width: '100%', height: '100%' }} />
          ) : (
            <div className="null-pic">
              暂无图片！点击截图按钮
              <LikeOutlined />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
```
页面样式
```scss
.video-content-box {
  .ant-card-body {
    display: flex;
    column-gap: 24px;
    height: 580px;

    .video-item {
      flex: 1;
    }

    .capture-pic-box {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px dashed #95e395;
      background: rgba(227, 248, 246, 0.5);
      padding: 12px;
      .ant-image {
        height: 100%;
      }
      .null-pic {
        display: flex;
        column-gap: 10px;
        justify-content: center;
        font-size: 18px;
        color: #888888;
      }
    }
  }
}
```