'use client';
import {
  Modal,
  Button,
  TextInput,
  Label,
  Textarea,
  FileInput,
  Flowbite,
} from 'flowbite-react';
import { useState } from 'react';
import { buttonTheme } from './themes';
import { FaImage } from 'react-icons/fa';
import { useRouter, redirect } from 'next/navigation';
import apiUrl from '../config';

interface CardModalProps {
  onCloseModal: () => void;
  showCloseButton?: boolean;
}

function CardModalNewTopic({
  onCloseModal,
  showCloseButton = true,
  onNewTag,
  user
}: any) {

  const [email, setEmail] = useState('');

  function onClose() {
    onCloseModal();
    setEmail('');
  }

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      name: name,
      image: image,
      description: description,
    };
    console.log(JSON.stringify({ data }));

    try {
      const response = await fetch(`${apiUrl}api/tag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image, description, user }),
      });
      const data = await response.json();
      console.log('the answer from the api after creating a new tag', data);
      if (response.ok) {
        onNewTag(data.result);
        console.log('Tag created successfully:');
        onCloseModal();
        window.location.reload();
      } else {
        console.error('Failed to create tag:', data.message);
      }
    } catch (error) {
      console.error(error);
    }
    setName('');
    setDescription('');
  };
  return (
    <>
      <Modal
        show={true}
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
            <h2 className="text-2xl font-semibold mb-4">Add New Topic/Tag</h2>
            <div id="add-name">
              <Label
                htmlFor="topic_name"
                className="text-black dark:text-black"
              >
                Topic/Tag Name
              </Label>
              <TextInput
                type="text"
                id="topic_name"
                name="name"
                placeholder="Enter topic name"
                onChange={handleNameChange}
                required
                className="text-black dark:text-black mt-2  rounded-md p-2"
              />
            </div>

            <div id="add-description" className="mt-4">
              <Label
                htmlFor="topic_notes"
                className="text-black dark:text-black"
              >
                Description
              </Label>
              <Textarea
                id="topic_notes"
                name="description"
                placeholder="Enter a tag/topic description here"
                onChange={handleDescriptionChange}
                className="text-black dark:text-black mt-2 border rounded-md p-2"
              />
            </div>

            <div id="upload-image" className="mt-4 ">
              <label
                htmlFor="file"
                className="text-black dark:text-black cursor-pointer"
              >
                Upload Image <br />
                <FaImage size={24} className="inline-block mr-2" />
                
              </label>
              <FileInput
                onChange={handleImageChange}
                id="file"
                className="mt-2 hidden" // hide the actual file input
              />
            </div>

            {/* Always render the close button */}
            {showCloseButton && (
              <Button
                className="text-white bg-purple-500 hover:bg-purple-600 py-2 px-4 rounded-md mt-4 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={onClose}
              >
                Close modal
              </Button>
            )}

            <Flowbite theme={{ theme: buttonTheme }}>
              <button
                type="submit"
                className={`mt-4 ${buttonTheme.button.color.primary} transition duration-300 ease-in-out transform hover:scale-105`}
              >
                Create
              </button>
            </Flowbite>
          </form>
      </Modal>
    </>
  );
}

export default CardModalNewTopic;
