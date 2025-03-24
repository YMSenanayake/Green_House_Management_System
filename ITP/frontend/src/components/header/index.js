import * as React from 'react';

export default function Navbar (){
    return (
        <nav className='shadow-sm'>
            <div className='container'>
                <div className='flex justify-between'>
                    <div>
                        <h1 className='text-xl font-bold'>Navbar</h1>
                    </div>
                    <div>
                        <ul className='flex items-center gap-6'>
                            <li>
                                <a className='inline-block py-4' href="#">Login</a>
                            </li>
                            <li>
                                <a href="#">Singup</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    )
}