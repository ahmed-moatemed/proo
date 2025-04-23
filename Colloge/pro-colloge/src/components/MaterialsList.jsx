import { useState, useEffect } from 'react';
import db from '../db';
import FilePreview from './FilePreview';
import '../styles/MaterialsList.css';

function MaterialsList({ userId }) {
  const [materials, setMaterials] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      const data = await db.materials.where({ userId }).toArray();
      setMaterials(data);
    };
    fetchMaterials();
  }, [userId]);

  return (
    <div className="materials-list">
      <h2>المواد الدراسية</h2>
      <ul>
        {materials.map((material) => (
          <li key={material.id} className="material-item">
            <span>{material.subject}</span>
            <button
               className="preview-button"
              onClick={() => setSelectedFile(material.fileUrl)}
            >
              معاينة
            </button>
          </li>
        ))}
      </ul>
      {selectedFile && <FilePreview fileUrl={selectedFile} onClose={() => setSelectedFile(null)} />}
    </div>
  );
}

export default MaterialsList;