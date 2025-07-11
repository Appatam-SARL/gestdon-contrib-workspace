import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';

const ImageUploader = ({ value, onChange, multiple = false }) => {
  const [previews, setPreviews] = useState([]);
  const handleChange = (e) => {
    const files = Array.from(e.target.files || []);
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
    onChange([...value, ...files]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    const newPreviews = previews.filter((item) => item !== index);
    const newFiles = value.filter((item) => item !== index);
    setPreviews(newPreviews);
    onChange(newFiles);
  };

  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium mb-2'>Logo / Photo</label>
      <input
        type='file'
        accept='image/*'
        onChange={handleChange}
        multiple={multiple}
        className='mb-2'
      />
      <div className='flex flex-wrap gap-4'>
        {previews.map((src, index) => (
          <div key={index} className='relative'>
            <img
              src={src}
              alt={`Logo ${index}`}
              className='h-20 object-contain border rounded'
            />
            <button
              type='button'
              onClick={() => removeImage(index)}
              className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full cursor-pointer p-1 text-xs'
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ImageUploader);
