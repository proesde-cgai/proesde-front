import React, { useCallback, useEffect, useMemo, useRef } from 'react';

const TinyMCEEditor = ({ fieldName, originalContent, setEditedContent }) => {
    const isInitializedRef = useRef(false);
    const lastOriginalContentRef = useRef(originalContent);
    const editorDivRef = useRef(null);
    const isFocusedRef = useRef(false);

    const normalizeHtmlTags = useCallback((html) => {
        if (!html) return '';
        return html
            .replace(/<strong>/gi, '<b>')
            .replace(/<\/strong>/gi, '</b>')
            .replace(/<em>/gi, '<i>')
            .replace(/<\/em>/gi, '</i>');
    }, []);

    const wrapVariableKeys = useCallback((html) => {
        if (!html) return '';

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = normalizeHtmlTags(html);

        const existingKeys = tempDiv.querySelectorAll('span[data-protected-key="true"]');
        existingKeys.forEach(span => {
            const textNode = document.createTextNode(span.textContent);
            span.parentNode?.replaceChild(textNode, span);
        });

        return tempDiv.innerHTML.replace(/\{[^}]+\}/g, match => (
            `<span data-protected-key="true" style="display: inline-block; padding: 1px 4px; margin: 0 2px; background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 4px; font-family: Arial, sans-serif; font-size: 9px; font-weight: 600; color: #856404; line-height: 1.4;">${match}</span>`
        ));
    }, [normalizeHtmlTags]);

    const extractCleanContent = useCallback((html) => {
        if (!html) return '';

        const normalizedHtml = normalizeHtmlTags(html);

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = normalizedHtml;

        const protectedKeys = tempDiv.querySelectorAll('span[data-protected-key="true"]');
        protectedKeys.forEach(span => {
            const textNode = document.createTextNode(span.textContent);
            span.parentNode?.replaceChild(textNode, span);
        });

        return tempDiv.innerHTML;
    }, [normalizeHtmlTags]);

    const initialValue = useMemo(() => {
        return wrapVariableKeys(originalContent);
    }, [originalContent, wrapVariableKeys]);

    useEffect(() => {
        const editorEl = editorDivRef.current;
        if (!editorEl || !isInitializedRef.current) return;

        if (originalContent === lastOriginalContentRef.current) return;

        if (isFocusedRef.current) return;

        const wrappedContent = wrapVariableKeys(originalContent);
        editorEl.innerHTML = wrappedContent;
        lastOriginalContentRef.current = originalContent;
        if (setEditedContent) {
            setEditedContent({
                [fieldName]: extractCleanContent(wrappedContent),
            });
        }
    }, [originalContent, wrapVariableKeys, extractCleanContent, fieldName, setEditedContent]);

    const syncEditedContentFromDom = useCallback(() => {
        if (!isInitializedRef.current) return;
        const editorEl = editorDivRef.current;
        if (!editorEl) return;

        const html = editorEl.innerHTML || '';

        const cleanContent = extractCleanContent(html);
        if (setEditedContent) {
            setEditedContent({
                [fieldName]: cleanContent,
            });
        }
    }, [extractCleanContent, fieldName, setEditedContent]);

    const focusEditor = useCallback(() => {
        const editorEl = editorDivRef.current;
        if (editorEl) editorEl.focus();
    }, []);

    const applyCommand = useCallback((command) => {
        focusEditor();
        document.execCommand(command, false, null);
        syncEditedContentFromDom();
    }, [focusEditor, syncEditedContentFromDom]);

    const handleKeyDown = useCallback((e) => {
        const key = e.key;
        if (key === 'Enter') {
            requestAnimationFrame(() => syncEditedContentFromDom());
        }
    }, [syncEditedContentFromDom]);

    const handleBeforeInput = useCallback((e) => {
        if (e.inputType === 'insertParagraph') {
            requestAnimationFrame(() => syncEditedContentFromDom());
        }
    }, [syncEditedContentFromDom]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const text = e.clipboardData?.getData('text/plain') ?? '';
        document.execCommand('insertText', false, text);
        syncEditedContentFromDom();
    }, [syncEditedContentFromDom]);

    const handleCut = useCallback((e) => {
        requestAnimationFrame(() => syncEditedContentFromDom());
    }, [syncEditedContentFromDom]);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        const text = e.dataTransfer?.getData('text/plain') ?? '';
        document.execCommand('insertText', false, text);
        syncEditedContentFromDom();
    }, [syncEditedContentFromDom]);

    const handleFocus = useCallback(() => {
        isFocusedRef.current = true;
    }, []);

    const handleBlur = useCallback(() => {
        isFocusedRef.current = false;
        syncEditedContentFromDom();

        const editorEl = editorDivRef.current;
        if (editorEl) {
            editorEl.innerHTML = wrapVariableKeys(extractCleanContent(editorEl.innerHTML));
        }
    }, [syncEditedContentFromDom, wrapVariableKeys, extractCleanContent]);

    useEffect(() => {
        const editorEl = editorDivRef.current;
        if (!editorEl) return;

        editorEl.innerHTML = initialValue;
        isInitializedRef.current = true;
        lastOriginalContentRef.current = originalContent;

        const cleanContent = extractCleanContent(initialValue);
        if (setEditedContent) {
            setEditedContent({
                [fieldName]: cleanContent,
            });
        }
        // Only run on mount so clicking/typing does not reset cursor when parent re-renders
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    gap: 8,
                    padding: '8px 10px',
                    border: '1px solid #e5e7eb',
                    borderBottom: 'none',
                    borderRadius: '8px 8px 0 0',
                    background: '#fff',
                }}
            >
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyCommand('bold')}
                    style={{
                        padding: '6px 10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                    aria-label="Bold"
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => applyCommand('italic')}
                    style={{
                        padding: '6px 10px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        background: '#fff',
                        cursor: 'pointer',
                        fontStyle: 'italic',
                        fontWeight: 600,
                    }}
                    aria-label="Italic"
                    title="Italic"
                >
                    I
                </button>
            </div>

            <div
                ref={editorDivRef}
                contentEditable
                suppressContentEditableWarning
                onInput={syncEditedContentFromDom}
                onKeyDown={handleKeyDown}
                onBeforeInput={handleBeforeInput}
                onPaste={handlePaste}
                onCut={handleCut}
                onDrop={handleDrop}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                    minHeight: 300,
                    maxHeight: 500,
                    overflowY: 'auto',
                    padding: 10,
                    border: '1px solid #e5e7eb',
                    borderRadius: '0 0 8px 8px',
                    background: '#fff',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: 9,
                    lineHeight: 1.8,
                    outline: 'none',
                    wordBreak: 'break-word',
                }}
            />
        </div>
    );
};

export default TinyMCEEditor;
