'use client';
import Link from 'next/link';
import React from 'react';
import CardModal from './ModalNote';
import { Flowbite, Button } from 'flowbite-react';
import 'primeicons/primeicons.css';
import { useState } from 'react';
import { buttonTheme } from './themes';
import UrlRender from './UrlRender';
import ImageRender, { image } from './ImageRender';
import FileRender from './FileRender';
import { FaTrashAlt } from "react-icons/fa";
import { TbTrash } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";

const Note = ({ note, onDelete }: any) => {
  const { id, title, content, urls, images, files } = note;
  // const { id: urlId, url, description: urlDescription } = urls || {};
  // const { id: imageId, image, description: imageDescription } = images || {};
  // const { id: fileId, file, description: fileDescription } = files || {};
  const [openModal, setOpenModal] = useState(false);
  

  const deleteIt = async () => {
    try {
      const result = await fetch(`http://localhost:3000/api/note`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (result.ok) {
        // Call the callback provided by the parent component
        onDelete(id);
        console.log("Note successfully deleted!")
      } else {
        console.error('Error deleting note:', result.statusText);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  
  const twnd = "h-40 w-auto"

  return (
    <div className=" mt-4 bg-white border-1 rounded-lg max-w-xs min-w-80 p-3 max-h-[500px] overflow-hidden relative group shadow-md">
      <Link href={`/notes/${id}`}>
        <div>
          <h2 className="font-bold text-center m-2">{title}</h2>
          <p>{content}</p><br />
          
          {/* Conditionally render URL */}
          {urls.length > 0 && (
            urls.map((url: { id: any; }) => {
              return (<UrlRender key={url.id} url={url} />);
            })
          )}
          
          {/* Conditionally render image */}
          {images.length > 0 && (
            images.map((image: image) => {
              return (<ImageRender key={image.id} image={image} twnd={twnd} />);
            })
          )}
          
          {/* Conditionally render file */}
          {files.length > 0 && (
            files.map((file: { id: any; }) => {
              return (<FileRender key={file.id} file={file} />);
            })
          )}

        </div>
      </Link>

      <div className=' h-16 w-full absolute bottom-0 right-0 justify-end items-center  flex'>
      <button onClick={() => setOpenModal(true)} className="focus:outline-none hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1 mx-2 opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500">
      <AiOutlineEdit size={28} color="black" />
      </button>
      {openModal && (
        <CardModal
          onCloseModal={() => setOpenModal(false)}
          showCloseButton={false}
        />
      )}
        <button onClick={deleteIt} className='hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1 mx-2 opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500'>
        <TbTrash size={"2em"}/>
        </button>
      </div>
    </div>
  );
};

export default Note;
