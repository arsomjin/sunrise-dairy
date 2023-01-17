import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ref as sRef,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { storage } from 'services/firebase';

import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { message, Modal, Progress, Spin, Upload } from 'antd';
import { useTranslation } from 'react-i18next';
import { showLog } from 'utils/functions/common';
import { showWarn } from 'utils/functions/common';
const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('คุณอัปโหลดได้เฉพาะไฟล์ JPG/PNG!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('รูปภาพต้องมีขนาดน้อยกว่า 2MB!');
  }
  return isJpgOrPng && isLt2M;
};
const UploadAvatar = forwardRef(
  (
    {
      value,
      onChange,
      storeRef,
      resizeMode,
      width,
      height,
      title,
      className,
      disabled,
      readOnly,
      ...props
    },
    ref
  ) => {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    // const [imageUrl, setImageUrl] = useState(
    //   value || require('assets/images/plus-sign.png')
    // );
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const { t } = useTranslation();

    const imageRef = useRef();

    useImperativeHandle(
      ref,
      () => ({
        focus: () => {
          imageRef.current.focus();
        },

        blur: () => {
          imageRef.current.blur();
        },

        clear: () => {
          imageRef.current.clear();
        },

        isFocused: () => {
          return imageRef.current.isFocused();
        },

        setNativeProps(nativeProps) {
          imageRef.current.setNativeProps(nativeProps);
        },
      }),
      []
    );

    useEffect(() => {
      // showLog({ image_update: value });
      setImageUrl(value);
    }, [value]);

    const handleChange = (info) => {
      if (info.file.status === 'uploading') {
        setLoading(true);
        return;
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
        });
      }
    };

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
      );
    };

    const imageHandler = (data) => {
      showLog({ data });
      if (data?.file) {
        setProgress(0);
        setLoading(true);
        const image = data?.file;
        let storageRef = storeRef || 'images';
        let imageName = image.name || `img${Date.now()}.png`;
        const imgStorageRef = sRef(storage, `${storageRef}/${imageName}`);

        const uploadTask = uploadBytesResumable(imgStorageRef, image);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // progrss function ....
            const mProgress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            // showLog('Upload is ' + mProgress + '% done');
            setProgress(mProgress);
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
              default:
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            showWarn(error);
            setLoading(false);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              setLoading(false);
              setImageUrl(downloadURL);
              onChange && onChange(downloadURL);
            });
          }
        );
      }
    };

    const uploadButton = (
      <div className="flex flex-col justify-center items-center">
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        {loading ? null : (
          <div
            style={{
              marginTop: 8,
            }}
          >
            {t('อัปโหลด')}
          </div>
        )}
      </div>
    );

    const progressing = progress > 0 && progress < 99;

    return (
      <>
        <ImgCrop>
          <Upload
            name="avatar"
            listType="picture-card"
            showUploadList={false}
            beforeUpload={beforeUpload}
            // onChange={handleChange}
            customRequest={imageHandler}
            onPreview={handlePreview}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  width: '100%',
                }}
              />
            ) : (
              uploadButton
            )}
            {progressing && (
              <Progress
                className="absolute top-1"
                percent={progress}
                type="circle"
                width={90}
              />
            )}
          </Upload>
        </ImgCrop>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img alt="preview" style={{ width: '100%' }} src={imageUrl} />
        </Modal>
      </>
    );
  }
);
export default UploadAvatar;
