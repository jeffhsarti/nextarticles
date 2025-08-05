"use client"
import React from "react";

export default function Footer() {
    return (
        <footer className="bg-white py-12 mt-12">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center space-x-6 mb-6">
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Twitter
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        Facebook
                    </a>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                        GitHub
                    </a>
                </div>
                <p className="text-gray-600">
                    Copyright © Business News 2025
                </p>
            </div>
        </footer>
    )
}