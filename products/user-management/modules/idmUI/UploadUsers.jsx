import { useState, useRef, useMemo } from 'react';
import { DialogContent, CircularProgress } from '@mui/material';
import { useIntl } from 'react-intl';
import { UserManagementAPI } from './apiEndpoints';
import { useNavigate } from "react-router-dom";
import { HAxiosService, HBox, HButton, HDropdown, HLabel, HDialog, useDrsTheme, useToast, withAlpha } from "@helix/component-library";
import { FiUpload } from 'react-icons/fi';
import { downloadSampleFile } from './downloadSampleFile';
import SampleTemplateSection from './SampleTemplateSection';

const UploadUsers = ({ open: controlledOpen, onClose, onImportSuccess }) => {
    const [internalOpen, setInternalOpen] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importPolicy, setImportPolicy] = useState('SKIP');
    const [isUploading, setIsUploading] = useState(false);
    const toast = useToast();
    const intl = useIntl();
    const { text, border, colors } = useDrsTheme();
    const fileInputRef = useRef(null);

    const isControlled = controlledOpen !== undefined;
    const dialogOpen = isControlled ? controlledOpen : internalOpen;

    let navigate;
    try {
        navigate = useNavigate();
    } catch (e) {
        console.warn("getNavigate called outside Router context");
        navigate = () => {};
    }

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const policyOptions = useMemo(() => [
        { label: intl.formatMessage({ id: "label.uploadUsers.policy.fail", defaultMessage: "Fail import" }), value: "FAIL" },
        { label: intl.formatMessage({ id: "label.uploadUsers.policy.skip", defaultMessage: "Skip" }), value: "SKIP" },
        { label: intl.formatMessage({ id: "label.uploadUsers.policy.overwrite", defaultMessage: "Overwrite" }), value: "OVERWRITE" }
    ], [intl]);

    const resetForm = () => {
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleClose = () => {
        resetForm();
        if (onClose) {
            onClose();
        } else {
            setInternalOpen(false);
            navigate("/homelayout/dashboard");
        }
    };

    const handleDialogClose = (_event, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
        }
        handleClose();
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
        } else {
            toast.error(intl.formatMessage({
                id: "error.uploadUsers.invalidExcel",
                defaultMessage: "Please select an Excel file (.xlsx or .xls)"
            }), {
                position: "top-right",
                autoClose: 2000,
            });
        }
    };

    const handleClearFile = () => {
        resetForm();
    };

    const handleDownloadSample = (fileName) =>
        downloadSampleFile(fileName, toast);

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error(intl.formatMessage({
                id: "error.uploadUsers.fileRequired",
                defaultMessage: "Please upload a file"
            }), {
                position: "top-right",
                autoClose: 2000,
            });
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('ifResourceExists', importPolicy);

        const realm = sessionStorage.getItem("SEC_REALM");
        try {
            const response = await HAxiosService.POST(UserManagementAPI.create_bulk_users(),
                formData,
                {},
                false,
                {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'X-REALM': realm
                }
            );

            if (response.data && Array.isArray(response.data) && response.data.length > 0) {
                const result = response.data[0];
                if (result.status === "SUCCESS") {
                    toast.success(intl.formatMessage({
                        id: "success.uploadUsers.importSuccess",
                        defaultMessage: "User Import Successful: {msg}"
                    }, { msg: result.msg }), {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    onImportSuccess?.();
                    handleClose();
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || intl.formatMessage({
                id: "error.uploadUsers.failedImport",
                defaultMessage: "Failed to process bulk user import"
            });
            console.error('Upload error:', error);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 2000,
            });
        } finally {
            setIsUploading(false);
        }
    };

    if (!dialogOpen) {
        return null;
    }

    return (
        <HDialog
            open={dialogOpen}
            onClose={handleDialogClose}
            maxWidth="sm"
            fullWidth
            title={intl.formatMessage({ id: "label.uploadUsers.title", defaultMessage: "Partial Import" })}
            titleSx={{
                fontWeight: 700,
                fontSize: 16,
                color: text.primary,
                py: 1.5,
                px: 2.5,
            }}
            contentProps={{ sx: { pt: 2.5, px: 2.5 } }}
            actions={
                <>
                    <HButton
                        onClick={handleClose}
                        variant="outlined"
                        label="label.user.cancel"
                    />
                    <HButton
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        variant="contained"
                        label={isUploading ? "label.uploadUsers.importing" : "label.uploadUsers.import"}
                        startIcon={
                            isUploading ? (
                                <CircularProgress size={14} sx={{ color: text.inverse }} />
                            ) : null
                        }
                    />
                </>
            }
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "16px",
                        border: `1px solid ${border.divider}`,
                        boxShadow: `0 12px 30px ${withAlpha(colors.primary, 0.19)}`,
                        overflow: "hidden",
                    }
                }
            }}
        >
            <>
                <HLabel
                    value={intl.formatMessage({ id: "label.uploadUsers.subtitle", defaultMessage: "Import users from an Excel file (.xlsx or .xls)." })}
                    sx={{ mb: 2, color: text.secondary, fontSize: 13 }}
                    colon={false}
                    align="left"
                />

                <SampleTemplateSection
                    fileName="BULK_UPLOAD_USERS_TEMPLATE_V1.xlsx"
                    templateLabel={intl.formatMessage({ id: "label.uploadUsers.sampleExcel", defaultMessage: "Bulk User Import Template" })}
                    onDownload={handleDownloadSample}
                    description={intl.formatMessage({ id: "label.uploadUsers.templateDesc", defaultMessage: "Download the sample template, add user details, then upload the completed file below." })}
                />

                <HBox sx={{ mb: 3, flexDirection: 'column', alignItems: 'stretch', background: 'transparent' }}>
                    
                    <HLabel
                        value={intl.formatMessage({ id: "label.uploadUsers.resourceFile", defaultMessage: "Resource File" })}
                        sx={{ mb: 1.5, color: text.primary, fontSize: 13 }}
                        colon={false}
                        align="left"
                    />
                    <HBox
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            background: 'transparent',
                        }}
                    >
                        <HButton
                            variant="outlined"
                            startIcon={<FiUpload size={14} />}
                            onClick={handleBrowseClick}
                            label="label.uploadUsers.browse"
                        />
                        <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                        />
                        <HButton
                            variant="outlined"
                            onClick={handleClearFile}
                            label="label.uploadUsers.clear"
                        />
                        <HLabel
                            value={selectedFile ? selectedFile.name : intl.formatMessage({ id: "label.uploadUsers.noFileSelected", defaultMessage: "No file selected" })}
                            sx={{
                                fontSize: 13,
                                color: selectedFile ? text.primary : text.tertiary,
                                fontStyle: selectedFile ? 'normal' : 'italic',
                                flex: 1,
                                minWidth: 160,
                            }}
                            colon={false}
                            align="left"
                        />
                    </HBox>
                </HBox>

                <HBox sx={{ flexDirection: 'column', alignItems: 'stretch', background: 'transparent' }}>
                    
                    <HLabel
                        value={intl.formatMessage({ id: "label.uploadUsers.resourceExistsPolicy", defaultMessage: "If a resource already exists" })}
                        sx={{ mb: 1, color: text.primary, fontSize: 13 }}
                        colon={false}
                        align="left"
                    />
                    <HDropdown
                        options={policyOptions}
                        value={importPolicy}
                        onChange={(e) => setImportPolicy(e.target.value)}
                        width="100%"
                    />
                </HBox>
            </>
        </HDialog>
    );
};

export default UploadUsers;
