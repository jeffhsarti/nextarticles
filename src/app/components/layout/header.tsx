"use client"
import Link from "next/link";
import React from "react";

export default function Header() {
    return (
        <nav className="fixed w-full z-50 bg-white bg-opacity-90 shadow">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="text-xl font-bold">
                        Business News
                    </Link>
                    <div className="space-x-6 flex flex-row">
                        <div>
                            <Link href="/" className="hover:text-gray-600 transition-colors">
                                Home
                            </Link>
                        </div>

                        <Link href="/" className="hover:text-gray-600 transition-colors">
                            About
                        </Link>
                        <Link href="/" className="hover:text-gray-600 transition-colors">
                            Contact
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}