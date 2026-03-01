/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu } from 'lucide-react'
import React, { useState } from 'react'
import MenuItems from './menu-items';
import userGlobalStore, { IUserGlobalStore } from '../store/users-global-store';

function Header() {
  const {user} = userGlobalStore() as IUserGlobalStore;
  const [openMenuItems, setOpenMenuItems] = useState(false);


  return (
    <div className='bg-neutral-950 p-5 text-white flex justify-between items-center'>
      <h1 className="font-bold text-white text-2xl">SPA</h1>
      <div className="flex gap-5 flex items-center">
        <h1 className="text-sm!">{user?.role} {user?.name}</h1>
        <Menu className='text-white cursor-pointer' size={15} onClick={()=> setOpenMenuItems(true)}/>
      </div>
      {openMenuItems && <MenuItems openMenuItems={openMenuItems} setOpenMenuItems={setOpenMenuItems}/>}
    </div>
  )
}

export default Header