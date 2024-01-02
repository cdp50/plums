// 'use client';
import {
  Modal,
  Button,
  TextInput,
  Label,
  Textarea,
  FileInput,
  Flowbite
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { buttonTheme } from './themes';
import Note from './Note';
import { TbTrash } from 'react-icons/tb';
import Image from 'next/image';
import apiUrl from '@/app/config'
import downloadWord from '../public/images/downloadWord.png'
import downloadExcel from '../public/images/excel.png'
import downloadPPT from '../public/images/ppt.png'
import downloadFile from '../public/images/file.png'
import downloadPDF from '../public/images/pdf.png'
import { AiOutlineEdit } from 'react-icons/ai';

interface image{
  id: string
  noteId: string
  image: string
  description: string
}
interface thisImage{
  id: string
  image: string
  description: string
}
interface file{
  id: string
  noteId: string
  file: string
  description: string
}
interface url{
  id: string
  noteId: string
  url: string
  description: string
}
type UrlObject = {
  id: string;
  url: string;
  description: string;
  isEditing: boolean;
};
interface note{
  id: string
  mutableTitle: string
  mutableContent: string
  tagIds: string[]
  authorId: string
  mutableImages: image[]
  files: file[]
  mutableUrls: url[]
}
interface props{
  onCloseModal: () => void
  showCloseButton: boolean
  note:note
  updateTitle: any 
  updateContent: any
  updateUrls: any
  updateNote:any
  updateImages:any
}

function ModalEditNote({ onCloseModal, showCloseButton = false, note,  updateTitle, updateContent, updateUrls, updateNote, updateImages }: props) {
  const { id, mutableTitle:title, mutableContent:content, mutableUrls:urls, mutableImages:images, files } = note;
  
  const [titleEdited, setTitleEdited] = useState(title);
  const [contentEdited, setContentEdited] = useState(content);
  const [imageModal, setImageModal] = useState(false);

  // Use state variables to track each URL and its description
  const [urlStates, setUrlStates] = useState(
    urls.map((url) => ({ id: url.id, url: url.url, description: url.description, isEditing: false }))
  );
  // Use state variables to track each image and its description
  const [imageStates, setImageStates] = useState(
    images.map((image) => ({ id: image.id, image: image.image, description: image.description }))
  );

  useEffect(() => {
    setTitleEdited(title);
  }, [title]);

  useEffect(() => {
    setContentEdited(content);
  }, [content]);

  // Update the URL state when URLs prop changes
  useEffect(() => {
    setUrlStates(
      urls.map((url) => ({ id: url.id, url: url.url, description: url.description, isEditing: false }))

    );
  }, [urls]);
  
  // Update the image state when images prop changes
  useEffect(() => {
    setImageStates(
      images.map((image) => ({ id: image.id, image: image.image, description: image.description }))

    );
  }, [images]);
  

  function onClose() {
    onCloseModal();
  }

// Handle changes for a specific URL
const handleUrlChange = (index: number, field: keyof UrlObject, value: string) => {
  const updatedUrlStates = [...urlStates] as UrlObject[];
  updatedUrlStates[index] = {
    ...updatedUrlStates[index],
    [field]: value,
  };
  setUrlStates(updatedUrlStates);
};

// Handle changes for a specific image
const handleImageChange = (index: number, field: keyof image, value: string) => {
  const updatedImageStates = [...imageStates] as image[];
  updatedImageStates[index] = {
    ...updatedImageStates[index],
    [field]: value,
  };
  setImageStates(updatedImageStates);
};

// Toggle the editing state for a specific URL
const toggleUrlEditing =  (index: number) => {
  const updatedUrlStates = [...urlStates] as UrlObject[];
  updatedUrlStates[index] = {
    ...updatedUrlStates[index],
    isEditing: !updatedUrlStates[index].isEditing,
  };
  setUrlStates(updatedUrlStates);
};

const handleImageDelete = async (id:string, index: number) => {
  try {
    const result = await fetch(`${apiUrl}api/image`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    
    if (result.ok) {
      
      console.log("Image successfully deleted!")
      updateImagesModal(index)
      // updateImages(imageStates)
      updateNote();
    } else {
      console.error('Error deleting image:', result.statusText);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};


// Handle image deletion for a specific index
const updateImagesModal = (index: number) => {
  setImageStates((prevImageStates: thisImage[]) => {
    // Create a new array with the item at the specified index removed
    const updatedImageStates = [...prevImageStates.slice(0, index), ...prevImageStates.slice(index + 1)];
    updateImages(updatedImageStates)
    return updatedImageStates;
  });
};

const handleEdit = async () => {
  try {
    // Exclude isEditing property from urlStates
    const urlStatesWithoutIsEditing = urlStates.map(({ isEditing, ...rest }) => rest);
    console.log("urlStatesWithoutIsEditing",urlStatesWithoutIsEditing)

    const response = await fetch(`${apiUrl}api/note`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        id,
        titleEdited,
        urlStates: urlStatesWithoutIsEditing,
        contentEdited,
        imageStates
      }),
    });

    const data = await response.json();

    if (response.ok) {
      
      updateTitle(data.result.title)
      updateContent(data.result.content)
      updateUrls(urlStatesWithoutIsEditing)
      updateImages(imageStates)
      updateNote();
      onCloseModal();
    } else {
      console.error('Failed to update note:', data);
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
      <Modal className=' sm:px-[10%] lg:px-[30%] mt-16' show={true}  popup dismissible>
        <div onClick={() => onCloseModal()} className='bg-gray-950 opacity-60 h-full w-full fixed top-0 left-0 z-40'></div>

        <div className='w-full mx-auto h-[600px] z-50 bg-white rounded-lg group/whiteBand'>

          <div className='title text-center border-gray-300 border-b-2 mt-6'>
            <textarea
              className='text-lg font-bold w-full text-center p-0 resize-none  focus:outline-none '
              value={titleEdited}
              onChange={(e) => setTitleEdited(e.target.value)}
              rows={2}
            />
          </div>

          <div className='content/urls overflow-y-auto h-80 pt-6'>
            <textarea
              className='text-base h-full w-full px-7 resize-none focus:outline-none'
              value={contentEdited}
              onChange={(e) => setContentEdited(e.target.value)}
              rows={2}
            />

            {/* Map through URL states and render textareas or clickable URLs based on the isEditing state */}
            {urlStates[0] &&(<p className='text-xs text-gray-500 px-5'>Url</p>)}
            {urlStates.map((url, index) => (
              <div key={url.id} className='flex hover:bg-slate-200 py-5  justify-between'>
                {url.isEditing ? (
                  <>
                    <div>
                      <textarea
                        className='text-base w-96 px-7 resize-none focus:outline-none'
                        value={url.url}
                        onChange={(e) => handleUrlChange(index, 'url', e.target.value)}
                        rows={2}
                      />
                      {url.description &&(<p className='text-xs text-gray-500 px-5'>Description</p>)}
                      <textarea
                        className='text-base w-full px-7 resize-none focus:outline-none'
                        value={url.description}
                        onChange={(e) => handleUrlChange(index, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <a
                      href={url.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className='text-blue-500 hover:underline px-7'
                    >
                      {url.url}
                    </a>
                    <p className='px-7'>{url.description}</p>
                  </>
                )}
                <button className='hover:bg-white rounded-md active:bg-slate-200 p-1 mx-2 duration-500 ml-auto h-8 my-auto' onClick={() => toggleUrlEditing(index)}>
                  {url.isEditing ? 'Save' : <AiOutlineEdit size={28} color="black" />}
                </button>
              </div>
            ))}

            <div className='files-container w-full '>
                {/* Map through files and display them */}
                
                {files.map((file) => (
                  
                  <div key={file.id} className='flex flex-row-reverse mt-3'>      
                  {file.file.includes("wordprocessingml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadWord} className='rounded-xl' width={128} height={128} alt='download Word document icon'></Image></a>)}
                  {file.file.includes("spreadsheetml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadExcel} className='rounded-xl' width={128} height={128} alt='download Excel document icon'></Image></a>)}
                  {file.file.includes("presentationml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadPPT} className='rounded-xl' width={128} height={128} alt='download PPT document icon'></Image></a>)}
                  {!file.file.includes("pdf;")&& !file.file.includes("wordprocessingml") && !file.file.includes("spreadsheetml") && !file.file.includes("presentationml") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"document"}><Image src={downloadFile} className='rounded-xl' width={128} height={128} alt='download PPT document icon'></Image></a>)}
                  {file.file.includes("pdf;") && ( <a href={file.file} target='_blank' rel="noopener noreferrer" download={"word_document"}><Image src={downloadPDF} className='rounded-xl' width={128} height={128} alt='download PPT document icon'></Image></a>)}
                  <p>{file.description}</p>

                  </div>
                ))}
              </div>
            </div>

          {/* New container for images */}
          <div className='documents-container flex justify-between  absolute w-full bottom-16  h-auto'>
          <div className='flex w-full'>
          {imageStates.length > 0 && (
            imageStates.map((image, index) => {
              return (
              <>
              <div key={image.id} className=' relative group/imgTrash'>
              <a onClick={()=> setImageModal(true)} > 
                
                  <Image width={128} height={128} src={image.image} alt={image.description} />
                
              </a>

              <button onClick={() => handleImageDelete(image.id, index)} className='absolute bottom-0 right-0 bg-slate-200 active:bg-slate-200 rounded-md p-1 mx-1 hover:bg-white opacity-0 group-hover/imgTrash:opacity-100 group-hover/imgTrash:transition-opacity group-hover/imgTrash:duration-500'>
              <TbTrash size={"1.5em"} />
            </button>

              
              </div>
              {/* Expaded image */}
              <Modal 
              show={imageModal} 
              onClose={() => setImageModal(false)} 
              popup 
              dismissible 
              className=' h-screen overflow-visible px-[30%] pt-20 pb-96'
              >
                {/* blackground for the modals OPEN!!! */}
                 <div onClick={() => setImageModal(false)} className='bg-gray-950 opacity-90 h-full w-full fixed top-0 left-0 z-40'></div>
                <div className=' max-h-[700px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col gap-3  '>
                  
                  
                    <textarea name="imageDescription" id="imageDescription" cols={50} rows={2}
                      className='rounded-lg bg-transparent text-white border-2 border-slate-600 p-3 focus:outline-none w-96 pr-11 mx-auto'
                      onChange={(e) => handleImageChange(index, 'description', e.target.value)}
                      value={image.description}
                    >
                      
                    </textarea>

                  <div className=' mx-auto relative bg-white rounded-[50px]'>
                    <Image width={500} height={500} src={image.image} alt={image.description} />
                  </div>
                </div>
              </Modal>
              
              </>
              );
              
            })
          )}
          
          </div>
          </div>

          <div className=' h-16 w-full absolute bottom-0 right-0 justify-end items-center  flex rounded-lg '>
            <button onClick={() => {}} className='hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1 mx-2 opacity-0 group-hover/whiteBand:opacity-100 group-hover/whiteBand:transition-opacity group-hover/whiteBand:duration-500 '>
              <TbTrash size={"2em"} />
            </button>
            <button onClick={handleEdit} className='hover:bg-black hover:bg-opacity-10 rounded-md active:bg-white p-1 mx-2 opacity-0 group-hover/whiteBand:opacity-100 group-hover/whiteBand:transition-opacity group-hover/whiteBand:duration-500 font-bold'>
              Save
            </button>
          </div>
        </div>
      </Modal>
    
  );
}

export default ModalEditNote;
