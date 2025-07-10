import { Message } from '@arco-design/web-vue';

function hasMessage(obj: unknown): obj is { message: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    typeof (obj as { message: unknown }).message === 'string'
  );
}

export function handleError(error: unknown) {
  let msg = '未知错误';
  if (typeof error === 'string') {
    msg = error;
  } else if (error instanceof Error) {
    msg = error.message;
  } else if (hasMessage(error)) {
    msg = error.message;
  }
  Message.error({ content: msg, duration: 3000, closable: true });
}
