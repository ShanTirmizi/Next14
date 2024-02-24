import { UploadDropzone } from '@/lib/uploadthing';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: 'serverImage' | 'messageFile';
}
const FileUpload = ({ endpoint, value, onChange }: FileUploadProps) => {
  const fileType = value?.split('.').pop();
  if (value && fileType !== 'pdf') {
    return (
      <>
        <Image src={value} alt="Server Image" width={200} height={200} />
        <Button onClick={() => onChange('')}>
          <X />
        </Button>
      </>
    );
  }
  return (
    <>
      <UploadDropzone
        appearance={{
          button:
            'ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-red-500 bg-none after:bg-orange-400',
          container: 'w-max flex-row rounded-md border-cyan-300 bg-slate-800',
          allowedContent:
            'flex h-8 flex-col items-center justify-center px-2 text-white',
        }}
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.error(error);
        }}
      />
    </>
  );
};

export default FileUpload;
