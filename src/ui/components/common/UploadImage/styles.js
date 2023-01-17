const styles = {
  label: {
    width: '100%',
    marginTop: '1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  imageUpload: {
    margin: 'auto',
    width: '140px',
    height: '32px',
    borderRadius: '10px',
    paddingTop: '4px',
    textAlign: 'center',
    alignItems: 'center',
  },
  decalUpload: {
    margin: 'auto',
    width: '140px',
    height: '32px',
    borderRadius: '10px',
    paddingTop: '4px',
    textAlign: 'center',
    alignItems: 'center',
  },
  icon: { marginRight: '5px', fontSize: '16px', marginTop: '2px' },
  fileMetaData: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '6px',
    fontWeigth: 'bold',
    backgroundColor: 'rgba(5, 5, 5, 0.55)',
    opacity: 0,
  },
  metaAside: {
    margin: 'auto',
    display: 'flex',
  },
  fileUploadContainer: {
    position: 'relative',
    margin: '5px 0 5px',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px dashed lightgrey',
  },
  removeFileIcon: {
    cursor: 'pointer',
  },
  imgPreview: {
    borderRadius: '6px',
    width: '100%',
    height: '100%',
  },
};

export default styles;
