import React from 'react'
import { FaCheckCircle } from 'react-icons/fa'

const PlanCard = ({title, description, price, selected, onClick, avantages, highlight }) => {
  return (
    <div
      onClick={onClick}
      className={`relative w-full max-w-sm rounded-lg shadow-md border transition-all duration-300 cursor-pointer overflow-hidden
        ${highlight ? "border-2 border-yellow-400 bg-yellow-50" : selected ? "border-purple-700 bg-purple-50 ring-2 ring-purple-600" : "border-gray-200 bg-white hover:shadow-lg"}
      `}
    >
      {highlight && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-white text-xs px-2 py-1 font-semibold rounded-bl-md">
          Populaire
        </div>
      )}
      <div className="p-6">
        <h3 className="mb-2 text-2xl font-bold tracking-tight text-purple-700">{title}</h3>
        <p className="mb-4 font-light text-gray-500 text-sm">{description}</p>
        <ul className="space-y-2 mb-6">
          {avantages.map((item, index) => (
            <li key={index} className="flex items-center text-gray-700 text-sm">
              <FaCheckCircle className="text-green-500 mr-2" />
              {item}
            </li>
          ))}
        </ul>
        <div className="text-xl font-semibold text-gray-800">{price}</div>
      </div>
    </div>
  )
}

export default PlanCard
