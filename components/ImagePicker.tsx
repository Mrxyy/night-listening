import React, { FC, useRef, useState } from 'react';
import {  ScanningOutline } from 'antd-mobile-icons';
import { Button, ImageUploader, ImageUploaderRef, ImageUploadItem } from 'antd-mobile';
import Compressor from 'compressorjs';

const ImagePicker = ({ handleFileChange }: {
  handleFileChange:(e:any)=>any
}) => {
  const fileInputRef = useRef<any>(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
          <ScanningOutline  onClick={handleIconClick} className="w-6 h-6" />
      </div>
    </div>
  );
};

const ManualOpenPhoto = ({fileList, setFileList}:any) => {
  const input = useRef<ImageUploaderRef>(null)

  return (
    <div>
      <ImageUploader
        ref={input}
        value={fileList}
        onChange={setFileList}
        upload={(file: File) => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ url: reader.result as string });
            };
            const MAX_SIZE_MB = 1;
            const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

            function compressFile(file:File, quality:number, callback:(f:File)=>any) {
                new Compressor(file, {
                    quality: quality,
                    convertSize: MAX_SIZE_BYTES, 
                    success(result: Blob) {
                      console.log(quality,result)
                      const toFile = new File([result], file.name, { type: file.type });
                        if (result.size > MAX_SIZE_BYTES && quality > 0.1) {
                            // If the compressed file is still larger than 1MB and quality is not too low, reduce quality and try again
                            const newQuality = Math.max(0.1, Number((MAX_SIZE_BYTES / file.size).toFixed(1)));
                            compressFile(toFile, newQuality, callback);
                        } else {
                            callback(toFile);
                        }
                    },
                    error(err:Error) {
                        console.error('Compression error:', err.message);
                    },
                });
            }
            if (file.size > MAX_SIZE_BYTES) {
              console.log(MAX_SIZE_BYTES , file.size)
              compressFile(file,Math.max(0.1, Number((MAX_SIZE_BYTES / file.size).toFixed(1))),(f)=>{reader.readAsDataURL(f)})
            }else{
              reader.readAsDataURL(file)
            }
          });
        }}
      >
        <ScanningOutline className="w-6 h-6 ml-auto" />
      </ImageUploader>
    </div>
  )
}

export default ManualOpenPhoto;
