import { toast, ToastPromiseParams } from 'react-toastify';
import { processErrorMessage } from '../../../common/error';

const position = toast.POSITION.TOP_CENTER;

const ToastError = (
    error: any,
    option?: Readonly<{
        autoClose?: number;
    }>
) =>
    toast.error(processErrorMessage(error), {
        autoClose: option?.autoClose ?? false,
        closeButton: true,
        position,
    });

const ToastInfo = (info: any) =>
    toast.info(info, {
        closeButton: true,
        position,
    });

const ToastPromise = <T extends Object>({
    promise,
    pending,
    success,
    error,
}: Readonly<{
    pending: ToastPromiseParams['pending'];
    success: ToastPromiseParams['success'];
    error: ToastPromiseParams['error'];
    promise: Promise<T>;
}>) =>
    toast.promise(
        promise,
        {
            pending,
            success,
            error,
        },
        {
            autoClose: 1000,
        }
    );

export { ToastError, ToastInfo, ToastPromise };
