import React from 'react'


const HeaderData = [
    { Label: "GetAllData", Link: "MyApi/GetApi" },
    { Label: "PostData", Link: "/MyApi/PostApi" },
    { Label: "UpdateData", Link: "/MyApi/PutApi" },
    { Label: "DeleteData", Link: "/MyApi/DeleteApi" },
    { Label: "Register", Link: "/RegisterPostApi" },
    { Label: "Login", Link: "/LoginPostApi" },
    { Label: "ValidateToken", Link: "/TokenGetApi" }
    ]

const Header = () => {
  return (
    <div className=' flex justify-between bg-rose-700'>
    <div className=' p-3 gap-4  flex'>
        {HeaderData.map((header)=>(
            <div key={header.Label} className=' bg-black text-white hover:bg-slate-600 border border-none p-2 rounded-lg outline-none '><a className=' text-white' href={`${header.Link}`}>{header.Label}</a></div>
        ))}
    </div>
    </div>
  )
}

export default Header