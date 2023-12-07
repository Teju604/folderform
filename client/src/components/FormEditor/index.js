import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';

const FormEditor = () => {
  const [categories, setCategories] = useState([
    {
      title: 'Category 1',
      items: [
        { text: 'Item 1', categories: [], order: 1, description: '', feedback: '', points: 0 },
        { text: 'Item 2', categories: [], order: 2, description: '', feedback: '', points: 0 },
      ],
    },
    {
      title: 'Category 2',
      items: [
        { text: 'Item 3', categories: [], order: 1, description: '', feedback: '', points: 0 },
        { text: 'Item 4', categories: [], order: 2, description: '', feedback: '', points: 0 },
      ],
    },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const updatedCategories = [...categories];
    const sourceCategoryIndex = result.source.droppableId;
    const destCategoryIndex = result.destination.droppableId;
    const [removed] = updatedCategories[sourceCategoryIndex].items.splice(result.source.index, 1);
    updatedCategories[destCategoryIndex].items.splice(result.destination.index, 0, removed);

    setCategories(updatedCategories);
  };

  const handleInputChange = (categoryIndex, itemIndex, property, value) => {
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex].items[itemIndex][property] = value;
    setCategories(updatedCategories);
  };

  const saveForm = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/forms', { categories });
      console.log(response.data);
      // Add any additional logic or redirection after saving
    } catch (error) {
      console.error('Error saving form:', error);
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2>{category.title}</h2>
            <Droppable droppableId={categoryIndex.toString()} key={categoryIndex}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {category.items.map((item, itemIndex) => (
                    <Draggable key={itemIndex} draggableId={itemIndex.toString()} index={itemIndex}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <p>{item.text}</p>
                          <input
                            type="text"
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => handleInputChange(categoryIndex, itemIndex, 'description', e.target.value)}
                          />
                          {/* Add input fields for feedback and points */}
                          {/* Add dropdown for selecting categories */}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
      <button onClick={saveForm}>Save Form</button>
      {/* Add functionality to add new categories and items */}
    </div>
  );
};

export default FormEditor;
