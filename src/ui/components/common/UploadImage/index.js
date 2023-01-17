import React, {
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
import styles from './styles';
import { Modal, Popconfirm, Progress, Spin } from 'antd';
import { showWarn } from 'utils/functions/common';
import { notificationController } from 'controllers/notificationController';
import { showLog } from 'utils/functions/common';

const RenderImage = ({
  url,
  className,
  hasValue,
  resizeMode,
  width,
  height,
}) => (
  <img
    alt=""
    src={url}
    className="text-slate-500"
    style={{
      ...styles.imgPreview,
      ...(!!hasValue
        ? {
            objectFit: resizeMode || 'cover',
            width: width || 110,
            height: height || 110,
          }
        : {
            objectFit: resizeMode || 'contain',
            width: 40,
            height: 40,
          }),
    }}
  />
);

export default forwardRef(
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
    const [imgURL, setImg] = useState(
      value || require('assets/images/plus-sign.png')
    );
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

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
      setImg(value || require('assets/images/plus-sign.png'));
    }, [value]);

    const imageHandler = (e) => {
      if (e.target.files[0]) {
        setProgress(0);
        setLoading(true);
        const image = e.target.files[0];
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
              setImg(downloadURL);
              onChange && onChange(downloadURL);
            });
          }
        );
      }
    };

    const handleUploadBtnClick = () => {
      if (!!readOnly || !!disabled) {
        !value &&
          notificationController.warning({
            message: ` ${!!readOnly ? 'อ่านอย่างเดียว' : 'ไม่สามารถแก้ไขได้'}`,
          });
        return;
      }
      !value && imageRef.current.click();
    };

    const _remove = () => {
      if (!!readOnly || !!disabled) {
        return notificationController.warning({
          message: ` ${!!readOnly ? 'อ่านอย่างเดียว' : 'ไม่สามารถแก้ไขได้'}`,
        });
      }
      onChange && onChange(null);
    };

    const _preview = () => {
      setVisible(true);
    };
    // showLog('uploadProps', props);

    const imgProps = {
      url: imgURL,
      className: className,
      hasValue: value,
      resizeMode: resizeMode,
      width: width,
      height: height,
    };

    const progressing = progress > 0 && progress < 99;
    return (
      <div style={{ display: 'inline-block' }} className="text-center">
        {title && <label className="text-primary">{title}</label>}
        <section
          onClick={handleUploadBtnClick}
          style={{
            display: !!value ? 'none' : 'flex',
            ...styles.fileUploadContainer,
            width: width || 110,
            height: height || 110,
            ...(!className && { borderRadius: (width || 110) / 2 }),
          }}
        >
          {loading && !progressing ? (
            <Spin>
              <RenderImage {...imgProps} />
            </Spin>
          ) : (
            <RenderImage {...imgProps} />
          )}
          {progressing && (
            <Progress
              percent={progress}
              type="circle"
              className="absolute top-1"
              width={100}
            />
          )}
          <input
            ref={imageRef}
            type="file"
            accept=".jpg,.png,.jpeg"
            name="image-upload"
            id="input"
            onChange={imageHandler}
            disabled={disabled}
            style={{ display: 'none' }}
          />
          <div
            style={{
              display: !!value ? 'none' : 'flex',
              ...styles.fileMetaData,
              ...(!className && { borderRadius: (width || 110) / 2 }),
            }}
          >
            <div style={styles.metaAside}>
              <i
                style={styles.removeFileIcon}
                className="fas fa-eye mx-3 cursor-pointer hover:scale-150"
                onClick={_preview}
              />
              {!(!!readOnly || !!disabled) && (
                <Popconfirm
                  title="ลบรูป ?"
                  onConfirm={_remove}
                  onCancel={() => showLog('cancel')}
                  okText="ยืนยัน"
                  cancelText="ยกเลิก"
                >
                  <i
                    style={{}}
                    // style={styles.removeFileIcon}
                    className="fas fa-trash-alt mx-3 cursor-pointer hover:scale-150"
                  />
                </Popconfirm>
              )}
            </div>
          </div>
        </section>
        <Modal
          open={visible && !!imgURL}
          footer={null}
          onCancel={() => setVisible(false)}
        >
          <img alt="preview" style={{ width: '100%' }} src={imgURL} />
        </Modal>
      </div>
    );
  }
);
