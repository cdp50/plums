'use client';
import React, { useEffect } from 'react';
import ModalEditNote from './ModalEditNote';
import 'primeicons/primeicons.css';
import { useState } from 'react';

import { TbTrash } from "react-icons/tb";
import { AiOutlineEdit } from "react-icons/ai";
import Link from 'next/link';
import Image from 'next/image';
import apiUrl from '../config';
import downloadWord from '../public/images/downloadWord.png'
import downloadExcel from '../public/images/excel.png'
import downloadPPT from '../public/images/ppt.png'
import downloadFile from '../public/images/file.png'
import downloadPDF from '../public/images/pdf.png'

const Note = ({ note, onDelete, onImageDelete }: any) => {
  const { id, title, content, urls, images, files } = note;
  const [openModal, setOpenModal] = useState(false);
  const [mutableTitle, setMutableTitle] = useState(title);
  const [mutableContent, setMutableContent] = useState(content);
  const [ mutableUrls, setMutableUrls] = useState(urls);
  const [ mutableImages, setMutableImages] = useState(images);
  const [mutableNote, setMutableNote] = useState(note)
  const [isEdited, setIsEdited] = useState(true)

//  /prisma/6574cf47f73eea0a045c7dd0
    
  if(isEdited){
    setMutableNote({ id, mutableTitle, mutableContent, mutableUrls, mutableImages, files });
    setIsEdited(false)
  }

  const updateImages = (NewImages: string[]) => {
    setMutableImages(NewImages)
    onImageDelete(NewImages, id);
  }
  
  const deleteIt = async () => {
    try {
      const result = await fetch(`${apiUrl}api/note`, {
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

  

  return (
    <div className='h-[405px] relative group hover:scale-105 transition duration-300 ease-in-out transform  shadow-md'>

    
    <div  className=" mt-4 bg-white border-1 cursor-pointer border-purple-600 rounded-lg max-w-sm w-80  min-w-80 p-4 max-h-[405px] h-[405px] overflow-y-auto  transition duration-300 ease-in-out transform  shadow-md">
      
      <a onClick={() => setOpenModal(true)}>
        
        <div>
        <h1 className="font-bold text-center text-2xl mb-2">{mutableTitle}</h1>
          <hr />
          <hr />
          <p className='italic text-gray-500 mb-2 text-xs'>Notes:</p>
          <p>{mutableContent}</p>
          
          {/* Conditionally render URL */}
          <br />
          
          {mutableUrls.length > 0 && (
            mutableUrls.map((url: { id: string, url:any, description:string }) => {
                return  (              
              <div id={id} key={id} >
                <p className='italic text-gray-500 mb-2 text-xs'>Links:</p>
              <a target='_blank' key={id} href={url.url}>{url.url}</a>
              <br />
              {url.description && <p>{url.description}</p>} 
              <br />
              </div>)
            })
          )}
          
          {/* Conditionally render image */}
          
          <div className='flex justify-center'>
          {mutableImages.length > 0 && (
            mutableImages.map((image: any) => {
              return (

                <div key={image.id}>
                <p className='italic text-gray-500 mb-2 text-xs'>Images:</p>
              
              <Image width={128} height={128} key={image.id} src={image.image} alt={image.description} />
              </div>
              
              );
            })
          )}
          </div>

          {/* Conditionally render file */}
          
          {files.length > 0 && (
            files.map((file: { id: any, file:string, description:string }) => {
              return (    <div id={id} key={file.id} >
                <p className='italic text-gray-500 mb-2 text-xs'>Files:</p>                
                {file.description && <p>{file.description}</p>}
                {file.file.includes("wordprocessingml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadWord} className='rounded-xl' width={100} height={100} alt='download Word document icon'></Image></a>)}
                  {file.file.includes("spreadsheetml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadExcel} className='rounded-xl' width={100} height={100} alt='download Excel document icon'></Image></a>)}
                  {file.file.includes("presentationml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadPPT} className='rounded-xl' width={100} height={100} alt='download PPT document icon'></Image></a>)}
                  {!file.file.includes("pdf;")&& !file.file.includes("wordprocessingml") && !file.file.includes("spreadsheetml") && !file.file.includes("presentationml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"document"}><Image src={downloadFile} className='rounded-xl' width={100} height={100} alt='download PPT document icon'></Image></a>)}
                  {file.file.includes("pdf;") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadPDF} className='rounded-xl' width={100} height={100} alt='download PPT document icon'></Image></a>)}
                <br />
            </div>);
            })
          )}

        </div>
      </a>
      
      {/* <button onClick={() => setOpenModal(true)} className="focus:outline-none hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1 mx-2 opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500">
      <AiOutlineEdit size={28} color="black" />
    </button> */}
      {openModal && (
        <ModalEditNote 
          onCloseModal={() => setOpenModal(false)}
          showCloseButton={false}
          note={mutableNote}
          updateTitle={(newTitle: string) => setMutableTitle(newTitle)}
          updateContent={(newComponent: string) => setMutableContent(newComponent)}
          updateUrls= {(newUrls: string[]) => setMutableUrls(newUrls)}
          updateImages= {(newImages: string[]) => updateImages(newImages)}
          updateNote={() => setIsEdited(true)}
        />
      )}

      </div>  
      <div className='absolute bottom-0 right-5 justify-end items-center flex'>
        <button onClick={deleteIt} className='hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1  opacity-0 group-hover:opacity-100 group-hover:transition-opacity group-hover:duration-500 group/animation'>
          <TbTrash size={"2em"}/>
        </button>
      </div>
    </div>
  );
};

export default Note;
