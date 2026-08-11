import { useEffect, useState } from 'react';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Viewer, Worker, SpecialZoomLevel, ProgressBar } from '@react-pdf-viewer/core';
import styles from './styles/ViewerPDF.module.css';
import Alert from '../../../reutilizable/Alert';
import Loading from '../../../reutilizable/Loading';

const ViewerPDF = ({ urlPdf }) => {
    const [loading, setLoading] = useState(true);
    const [pdfURL, setPdfURL] = useState(null);
    const [message, setMessage] = useState({
        type: null,
        message: null,
    });

    useEffect(() => {

        // Check if urlPdf is valid and is a Blob
        if (!urlPdf || !(urlPdf instanceof Blob)) {
            setMessage({ type: 'error', message: 'Invalid or missing PDF data' });
            setLoading(false);
            return;
        }

        // Create an object URL for the Blob
        const url = URL.createObjectURL(urlPdf);
        setPdfURL(url);
        setLoading(false);

        // Cleanup the URL when the component unmounts
        return () => URL.revokeObjectURL(url);
    }, [urlPdf]);

    // If still loading, show the Loading component
    if (loading) return <Loading />;

    // If there's an error message, display it
    if (message.type) {
        return (
            <Alert typeAlert={message.type}>
                <p>{message.message}</p>
            </Alert>
        );
    }

    // If the PDF URL is available, render the PDF viewer
    return (
        <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
            <div className={styles.containerPdf}>
                {pdfURL ? (
                    <Viewer
                        fileUrl={pdfURL}
                        defaultScale={SpecialZoomLevel.PageWidth}
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
