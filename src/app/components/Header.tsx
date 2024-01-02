'use client';
import exp from 'constants';
import { useScrollTop } from './use-scroll-top';
import Link from 'next/link';
import Image from 'next/image';
import plumsTitle from '../public/images/plums-title.png';
import plumsProfile from '../public/images/plum_profile.svg';

import CardModalNewTopic from '../components/ModalNewTopic';

import CardModal from '../components/ModalNote';
import { useState } from 'react';
import React, { useEffect } from 'react';
import apiUrl from '../config';
import { useUser } from '@auth0/nextjs-auth0/client';

const purpleBackgroundColor = {
  backgroundColor: 'rgba(250, 245, 255, 1)',
};

function Header() {
  const [openModalNewTopic, setOpenModalNewTopic] = useState(false);
  const [openModalNewNote, setOpenModalNewNote] = useState(false);
  const [tagIdToDelete, setTagIdToDelete] = useState<string | null>(null);
  const scrolled = useScrollTop();
  const headerStyle = `flex justify-between items-center px-1 py-1 min-h-fit${
    scrolled ? ' border-b shadow' : ''
  }`;

  interface tagResponse {
    id: string;
    name: string;
    description: string;
    image: string;
    authorId: string;
  }
  const { user, error, isLoading } = useUser();
  const [tags, setTags] = useState<tagResponse[]>([]);

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
        setTags(tagsData);
      }
    };
    fetchData();
  }, [tagIdToDelete]); // Run once when the component mounts
  console.log(tags);

  const handleNewTag = async (newTag: tagResponse) => {
    setTags((prevTags) => [...prevTags, newTag]);
  };
  
  
  let profileImg;
  let userInfo;
  if(!isLoading){
    profileImg = user?.picture;
    userInfo = user;
  } else {
    profileImg = plumsProfile;
  }

  if(user){
    return (
      <header className="sticky top-0 bg-white z-50">
        <nav>
          <ul
            className={
              headerStyle + ' flex justify-between items-center bg-white px-16'
            }
          >
            {/* Home button on the left */}
            <li>
              <Link
                href="/"
                className="pi pi-home text-black "
                style={{ fontSize: '2rem', padding: '10px' }}
              ></Link>
            </li>
  
            {/* Centered items */}
            <ul className="flex justify-evenly items-center space-x-4 flex-grow">
              {/* Notes buttons */}
              <button
                className="p-1 flex-shrink-0 text-lg"
                onClick={() => setOpenModalNewTopic(true)}
              >
                <span style={{ fontWeight: 'bold' }}>&#10133;</span> Tag
              </button>
  
              {openModalNewTopic && (
                <CardModalNewTopic
                  onCloseModal={() => setOpenModalNewTopic(false)}
                  showCloseButton={false}
                  onNewTag={handleNewTag}
                  user={user}
                />
              )}
  
              <button
                className="p-1 flex-shrink-0 text-lg "
                onClick={() => setOpenModalNewNote(true)}
              >
                <span style={{ fontWeight: 'bold' }}>&#10133;</span> Note
              </button>
  
              {openModalNewNote && (
                <CardModal
                  onCloseModal={() => setOpenModalNewNote(false)}
                  showCloseButton={false}
                  user={user}
                />
              )}
  
              <button className="p-1 flex-shrink-0 text-lg">All Notes</button>
              <button className="p-1 flex-shrink-0 text-lg">
                <a href="/api/auth/logout">Sign Out</a>
              </button>
            </ul>
  
            {/* Plums title and image on the right */}
            <li className="flex items-center">
              {/* Plums title (centered on small screens) */}
              <div className="hidden md:block p-2">
                <div className="w-40">
                  <Image src={plumsTitle} alt="title" />
                </div>
              </div>
  
              {/* Plum image on the right */}
              <div className="hidden w-12 md:block  ml-auto">
                <Image src={profileImg} alt="Plum-Image" width={48} height={48} className='rounded-3xl' />
              </div>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
