import { useEffect, useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Viewer, Worker, SpecialZoomLevel, ProgressBar } from '@react-pdf-viewer/core';
import Loading from './Loading';
import { visorDocumentosService } from '../features/visorDeDocumentos/services/visorDocumentosService';
import { ERROR_MESSAGES_GENERICS_API } from '../utils/messagesFromAPI'
import styles from './styles/ViewerPDF.module.css';
import Alert from './Alert';

const ViewerPDF = ({ urlPdf }) => {
  const [loading, setLoading] = useState(true);
  const [pdfURL, setUrlPDF] = useState();
  const [message, setMessage] = useState({
    type: null,
    message: null,
  });

  useEffect(() => {
    setMessage(null)

    visorDocumentosService(urlPdf)
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setUrlPDF(url)
      })
      .catch(error => {
        if (error.response) {
          const message = ERROR_MESSAGES_GENERICS_API[error.response.status] || ERROR_MESSAGES_GENERICS_API.default;
          setMessage({
            type: 'error',
            message
          });
        }
      })
      .finally(() => setLoading(false))
  }, [urlPdf])

  if (loading) return <Loading/>
  
  if (message) {
    return (
      <Alert typeAlert={message.type}>
        <p>{message.message}</p>
      </Alert>
    );
  }

  return (
    <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
      <div className={styles.containerPdf}>
        {pdfURL && (
          <Viewer
            fileUrl={pdfURL}
            defaultScale={SpecialZoomLevel.PageWidth}
            renderLoader={(percentages) => (
              <div style={{ width: '240px' }}>
                <ProgressBar progress={Math.round(percentages)} />
              </div>
            )}
          />
        )}
      </div>
    </Worker>
  );
};

export default ViewerPDF;