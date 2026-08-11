import { useEffect, useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Viewer, Worker, SpecialZoomLevel, ProgressBar } from '@react-pdf-viewer/core';
import styles from './styles/ViewerPDF.module.css';
import Alert from '../../../../reutilizable/Alert';
import Loading from '../../../../reutilizable/Loading';

const ViewerPDF = ({ urlPdf, scale = SpecialZoomLevel.PageWidth }) => {
    const [loading, setLoading] = useState(true);
    const [pdfURL, setPdfURL] = useState(null);
    const [message, setMessage] = useState({
        type: null,
        message: null,
    });

    useEffect(() => {
        

        if (!urlPdf || !(urlPdf instanceof Blob)) {
            setMessage({ type: 'error', message: 'Invalid or missing PDF data' });
            setLoading(false);
            return;
        }

        const url = URL.createObjectURL(urlPdf);
        setPdfURL(url);
        setLoading(false);

        return () => URL.revokeObjectURL(url);
    }, [urlPdf]);

    if (loading) return <Loading />;

    if (message.type) {
        return (
            <Alert typeAlert={message.type}>
                <p>{message.message}</p>
            </Alert>
        );
    }

    return (
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
            <div className={styles.containerPdf}>
                {pdfURL ? (
                    <Viewer
                        key={`pdf-viewer-${scale}`}
                        fileUrl={pdfURL}
                        defaultScale={scale}
                        renderLoader={(percentages) => (
                            <div style={{ width: '240px' }}>
                                <ProgressBar progress={Math.round(percentages)} />
                            </div>
                        )}
                    />
                ) : (
                    <p>No PDF available</p>
                )}
            </div>
        </Worker>
    );
};

export default ViewerPDF;

