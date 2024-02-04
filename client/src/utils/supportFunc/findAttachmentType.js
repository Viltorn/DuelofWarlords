const findAttachmentType = (attachment, type) => attachment?.type === type || attachment?.type === 'all';
export default findAttachmentType;
