'use client';

import { useState, useEffect } from 'react';
import { getZones, createZone, updateZone, deleteZone } from '@/lib/api';
import { Zone } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function ZonesTable() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingZone, setEditingZone] = useState<Partial<Zone> | null>(null);
  const [newZone, setNewZone] = useState<{
    name: string;
    deliveryPrice: number;
    isActive: boolean;
    description?: string;
  }>({
    name: '',
    deliveryPrice: 0,
    isActive: true,
    description: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const data = await getZones();
      setZones(data);
    } catch (error) {
      console.error('Failed to fetch zones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!newZone.name.trim()) {
      alert('Please enter a zone name');
      return;
    }

    if (newZone.deliveryPrice <= 0) {
      alert('Please enter a delivery price greater than 0');
      return;
    }

    try {
      const createdZone = await createZone({
        name: newZone.name.trim(),
        deliveryPrice: newZone.deliveryPrice,
        isActive: true
      });
      setZones([...zones, createdZone]);
      setNewZone({ name: '', deliveryPrice: 0, isActive: true, description: '' });
    } catch (error) {
      console.error('Failed to create zone:', error);
      alert('Failed to create zone. Please try again.');
    }
  };

  const handleUpdateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingZone?._id) return;

    // Validate inputs
    if (!editingZone.name?.trim()) {
      alert('Please enter a zone name');
      return;
    }

    if (!editingZone.deliveryPrice || editingZone.deliveryPrice <= 0) {
      alert('Please enter a delivery price greater than 0');
      return;
    }

    try {
      const updatedZone = await updateZone(editingZone._id, {
        name: editingZone.name.trim(),
        deliveryPrice: editingZone.deliveryPrice,
        isActive: editingZone.isActive
      });
      
      setZones(zones.map(zone => 
        zone._id === updatedZone._id ? updatedZone : zone
      ));
      setEditingZone(null);
    } catch (error) {
      console.error('Failed to update zone:', error);
      alert('Failed to update zone. Please try again.');
    }
  };

  const handleDeleteZone = async (id: string) => {
    try {
      await deleteZone(id);
      setZones(zones.filter(zone => zone._id !== id));
    } catch (error) {
      console.error('Failed to delete zone:', error);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Zones Management</h2>
        <button 
          onClick={() => {
            setEditingZone(null);
            setShowForm(true);
          }}
          className="bg-gold text-white px-4 py-2 rounded-md hover:bg-gold-600 transition-colors"
        >
          + Add New Zone
        </button>
      </div>
      
      {/* Create/Edit Zone Form */}
      {(showForm || editingZone) && (
        <form 
          onSubmit={editingZone?._id ? handleUpdateZone : handleCreateZone} 
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Zone Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter zone name"
              value={editingZone ? editingZone.name || '' : newZone.name}
              onChange={(e) => 
                editingZone 
                  ? setEditingZone({...editingZone, name: e.target.value})
                  : setNewZone({...newZone, name: e.target.value})
              }
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-gold focus:border-gold shadow-sm"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Delivery Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">₦</span>
              <input
                type="number"
                placeholder="Enter delivery price"
                value={editingZone ? editingZone.deliveryPrice || '' : newZone.deliveryPrice || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  if (editingZone) {
                    setEditingZone({...editingZone, deliveryPrice: value});
                  } else {
                    setNewZone({...newZone, deliveryPrice: value});
                  }
                }}
                required
                min="0"
                step="100"
                className="w-full border border-gray-300 rounded-md pl-8 pr-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-gold focus:border-gold shadow-sm"
              />
            </div>
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              placeholder="Optional description"
              value={editingZone ? editingZone.description || '' : newZone.description}
              onChange={(e) => 
                editingZone 
                  ? setEditingZone({...editingZone, description: e.target.value})
                  : setNewZone({...newZone, description: e.target.value})
              }
              className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-gold focus:border-gold shadow-sm"
            />
          </div>
          <div className="md:col-span-1 flex items-end space-x-3">
            <button 
              type="submit" 
              className="flex-1 bg-gold text-white px-6 py-2.5 rounded-md hover:bg-gold-600 transition-colors font-medium shadow-sm"
            >
              {editingZone ? 'Update Zone' : 'Create Zone'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setEditingZone(null);
                setShowForm(false);
                setNewZone({ name: '', deliveryPrice: 0, isActive: true, description: '' });
              }}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-md hover:bg-gray-300 transition-colors font-medium shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Zones Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Delivery Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {zones.map((zone) => (
              <tr key={zone._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{zone.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(zone.deliveryPrice)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{zone.description || 'No description'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => {
                      setEditingZone(zone);
                      setShowForm(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4 font-medium"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteZone(zone._id)}
                    className="text-red-600 hover:text-red-900 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {!loading && zones.length === 0 && (
        <div className="text-center py-10 px-4 sm:px-6 lg:px-8">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No zones</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new zone.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => {
                setEditingZone(null);
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gold hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
            >
              + Add Zone
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 