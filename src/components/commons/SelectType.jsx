import React from 'react'

const SelectType = ({ value, onChange,types }) => {
    return (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Type d'organisation</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none focus:ring-purple-500"
          >
            <option value="">Sélectionner</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      );
}

export default SelectType
