import React, { FC, useRef, useState } from 'react';
import {  ScanningOutline } from 'antd-mobile-icons';
import { Button, ImageUploader, ImageUploaderRef, ImageUploadItem } from 'antd-mobile';

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

const ManualOpenPhoto: FC = ({fileList, setFileList}:any) => {
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
            reader.readAsDataURL(file);
          });
        }}
      >
        <ScanningOutline className="w-6 h-6 ml-auto" />
      </ImageUploader>
    </div>
  )
}

export default ManualOpenPhoto;
