// 'use client';
import {
  Modal,
  Button,
  TextInput,
  Label,
  Textarea,
  FileInput,
  Flowbite,
} from 'flowbite-react';
import { useEffect, useState } from 'react';
import { buttonTheme } from './themes';
import Note from './Note';
import TagDropdown from './TagDropdown';
import prisma from '@/app/data';
import router from 'next/router';
import { FaImage } from 'react-icons/fa';
import { AiOutlineUpload } from 'react-icons/ai';
import { FaLink } from 'react-icons/fa';
import apiUrl from '../config';

interface CardModalProps {
  onCloseModal: () => void;
  showCloseButton?: boolean;
  user: any;
}
interface tagResponse {
  id: string;
  name: string;
}

function CardModalNote({
  onCloseModal,
  showCloseButton = true,
  user
}: CardModalProps) {
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [urlNote, setUrlNote] = useState('');
  const [image, setImage] = useState('');
  const [imageNote, setImageNote] = useState('');
  const [file, setFile] = useState('');
  const [fileNote, setFileNote] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<tagResponse[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  function onClose() {
    onCloseModal();
    setEmail('');
  }

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email) {
        const email = user.email;
        const result = await fetch(`${apiUrl}api/tag?userEmail=${encodeURIComponent(email)}`, {
          cache: 'no-store',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const tagsData: tagResponse[] = await result.json();
        console.log("tagsData", tagsData)
        setTags(tagsData);
      }
    };
    fetchData();
  }, []); // Run once when the component mounts
  const handleTagSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };
  const handleDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    console.log('handleTitleChange was called');
  };
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };
  const handleUrlNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrlNote(event.target.value);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleImageChange was called")
    const fileInput = event.target;
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      let fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        if (fileLoadedEvent.target) {
          let srcData = fileLoadedEvent.target.result as string;
          setImage(srcData);
        }
      };

      fileReader.readAsDataURL(selectedFile);
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("handleFileChange was called")
    const fileInput = event.target;
    console.log("file input", event.target)
    if (fileInput.files && fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      let fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        if (fileLoadedEvent.target) {
          let srcData = fileLoadedEvent.target.result as string;
          setFile(srcData);
        }
      };

      fileReader.readAsDataURL(selectedFile);
    }
  };
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };
  const handleImageNoteChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setImageNote(event.target.value);
  };
  const handleFileNoteChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setFileNote(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log("the content of the request before calling the api",JSON.stringify({ title,
    //   url,
    //   urlNote,
    //   image,
    //   imageNote,
    //   file,
    //   fileNote,
    //   content,
    //   selectedTags }))
    try {
      const response = await fetch(`${apiUrl}api/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          url,
          urlNote,
          image,
          imageNote,
          file,
          fileNote,
          content,
          selectedTags,
          user
        }),
      });
      const data = await response.json();
      console.log('the answer from the api data with the note', data);
      if (response.ok) {
        console.log('Note created successfully:', data);
        window.location.reload();
        // router.replace("/welcome"); // Use replace instead of refresh for client-side navigation
      } else {
        console.error('Failed to create note:', data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Modal
        show={true}
        size="xl"
        onClose={onCloseModal}
        popup
        dismissible
        className="p-[80px] max-w-[400px] min-w-[600px] mx-auto rounded-lg text-black items-center "
      >
        <div onClick={onCloseModal} className='bg-gray-950 opacity-60 h-full w-full fixed top-0 left-0 z-40'></div>
          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-4 bg-white rounded-lg max-w-[400px] mx-auto z-50 "
          >
            <h2 className="text-2xl font-semibold mb-4">Create New Note</h2>
            <div id="tagSelect">
              <Label
                htmlFor="tagSelect"
                className="text-black dark:text-black"
              ></Label>
              <div className="relative inline-block text-left">
                <div>
                  <span className="rounded-md shadow-sm">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      id="options-menu"
                      onClick={handleDropdownToggle}
                      
                    >
                      Select Tag
                    </button>
                  </span>
                </div>
                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 space-y-2 bg-white rounded-md shadow-lg">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex ">
                          <input
                            type="checkbox"
                            value={tag.id}
                            checked={selectedTags.includes(tag.id)}
                            onChange={() => handleTagSelection(tag.id)}
                            className="mr-2 form-checkbox"
                          />

                          {tag.name}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div id="add-title">
              <Label htmlFor="title" className="text-black dark:text-black">
                Title:
              </Label>
              <TextInput
                type="text"
                id="title"
                placeholder="  Enter topic name"
                onChange={handleTitleChange}
                className="text-black dark:text-black"
              />
            </div>
            <div id="add-notes">
              <Label
                htmlFor="topic_notes"
                className="text-black dark:text-black"
              >
                Notes
              </Label>
              <Textarea
                id="topic_notes"
                placeholder="Enter your personal notes here:"
                onChange={handleContentChange}
                className="text-black dark:text-black"
              />
            </div>
            <div className="flex items-center">

                <div id="add-url">
                  <Label
                    htmlFor="topic_url"
                    className="text-black dark:text-black "
                  ></Label>
                  <div className="flex items-center">
                    <FaLink size={20} className="mr-2 " />
                    <TextInput
                      type="text"
                      id="topic_url"
                      placeholder="Enter new URL"
                      onChange={handleUrlChange}
                      className="text-black dark:text-black mt-2 "
                    />
                  </div>
                </div>

                <div id="add-urlNote">
                  <Label
                    htmlFor="topic_url"
                    className="text-black dark:text-black"
                  ></Label>
                  <TextInput
                    type="text"
                    id="topic_urlNote"
                    placeholder="Description"
                    onChange={handleUrlNoteChange}
                    className="text-black dark:text-black"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center">
                <div id="upload-image">
                  <label
                    htmlFor="image"
                    className="text-black dark:text-black cursor-pointer"
                  >
                    <FaImage size={24} className=" mr-2" />
                  </label>
                  <FileInput
                    onChange={handleImageChange}
                    id="image"
                    className="text-black dark:text-black mt-2 hidden"
                  />
                </div>

                <div id="add-imageNote">
                  <Label
                    htmlFor="topic_notes"
                    className="text-black dark:text-black "
                  ></Label>
                  <Textarea
                    id="topic_imageNotes"
                    placeholder="Description"
                    onChange={handleImageNoteChange}
                    className="text-black dark:text-black"
                  />
                </div>
              </div>
              <div className="flex flex-row items-center">
                <div id="upload-file">
                  <label
                    htmlFor="file"
                    className="text-black dark:text-black cursor-pointer"
                  >
                    {' '}
                    <AiOutlineUpload
                      size={24}
                      className="inline-block mr-2"
                    />{' '}
                  </label>
                  <FileInput
                    id="file"
                    onChange={handleFileChange}
                    className="text-black dark:text-black mt-2 hidden"
                  />
                </div>

                <div id="add-fileNote">
                  <Label
                    htmlFor="topic_notes"
                    className="text-black dark:text-black"
                  >
                
                  </Label>
                  <Textarea
                    id="topic_fileNotes"
                    placeholder="Description"
                    onChange={handleFileNoteChange}
                    className="text-black dark:text-black"
                  />
                </div>
              </div>


            {/* Always render the close button */}
            {showCloseButton && (
              <Button
                className="text-black bg-purple-500 hover:bg-purple-600 py-2 px-4 rounded-md"
                onClick={onClose}
              >
                Close modal
              </Button>
            )}

            <br />
            <Flowbite theme={{ theme: buttonTheme }}>
              <button
                type="submit"
                className={`mb-4 ${buttonTheme.button.color.primary}`}
              >
                Create Note
              </button>
            </Flowbite>
          </form>
      </Modal>
    </>
  );
}

export default CardModalNote;
