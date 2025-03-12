import { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text as KonvaText, Image as KonvaImage } from 'react-konva';
import {
  Brush, Eraser, Square, Circle as CircleIcon, Type, RefreshCcw, Trash2, ArrowLeftCircle, Upload, Crop, RotateCcw, FlipHorizontal, FlipVertical
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import { io } from 'socket.io-client';
import Button from './Form/Button';
import { toast } from 'react-toastify';
import { mintNFT } from '../contract/functionCalls';
import { useSelector } from 'react-redux';

const ENDPOINT = "https://blockathon.onrender.com"
const socket = io(ENDPOINT, {
  transports: ["websocket", "polling"] // Fallback to polling if WebSocket fails
});


const DrawingCanvas = () => {
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [texts, setTexts] = useState([]);
    const [images, setImages] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);
    const [selectedTool, setSelectedTool] = useState('brush');
    const [text, setText] = useState('');
    const [cropData, setCropData] = useState({ x: 0, y: 0 });
    const [croppingImage, setCroppingImage] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const stageRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}")
  const {connectWallet} = useSelector((state) => state.user)
   

    useEffect(() => {
      !currentUser?.validUser && window.location.replace("/auth/sign-in")
      !currentUser?.validUser && toast.error("Login first to access this page")
    },[currentUser])

const handleMouseDown = () => {
  setIsDrawing(true);
  const pos = stageRef.current.getPointerPosition();

  if (selectedTool === 'brush') {
    const newLine = { points: [pos.x, pos.y], color: brushColor, width: brushSize };
    setLines([...lines, newLine]);
    socket.emit('draw', { tool: 'brush', line: newLine });
  } else if (selectedTool === 'rectangle') {
    const newShape = { type: 'rectangle', x: pos.x, y: pos.y, color: brushColor, width: 100, height: 100 };
    setShapes([...shapes, newShape]);
    socket.emit('draw', { tool: 'rectangle', shape: newShape });
  } else if (selectedTool === 'circle') {
    const newCircle = { type: 'circle', x: pos.x, y: pos.y, color: brushColor, radius: 50 };
    setShapes([...shapes, newCircle]);
    socket.emit('draw', { tool: 'circle', shape: newCircle });
  } else if (selectedTool === 'text' && text) {
    const newText = { text, x: pos.x, y: pos.y, color: brushColor };
    setTexts([...texts, newText]);
    socket.emit('draw', { tool: 'text', text: newText });
    setText('');
  }
};



          const handleMouseMove = () => {
        if (!isDrawing) return;

        const stage = stageRef.current;
        const point = stage.getPointerPosition();

        if (selectedTool === 'brush') {
          const lastLine = lines[lines.length - 1];
          lastLine.points = lastLine.points.concat([point.x, point.y]);
          lines.splice(lines.length - 1, 1, lastLine);
          setLines(lines.concat());
        } else if (selectedTool === 'eraser') {
          const lastLine = lines[lines.length - 1];
          lastLine.points = lastLine.points.concat([point.x, point.y]);
          lines.splice(lines.length - 1, 1, lastLine);

          // Set a semi-transparent white stroke to simulate gradual erasing
          lastLine.color = 'rgba(255, 255, 255, 0.1)'; // Light white with low opacity
          setLines(lines.concat());
        }
      };

    const handleMouseUp = () => {
      setIsDrawing(false);
    };

    const handleImageUpload = (e) => {
      const files = Array.from(e.target.files);
      files.forEach((file) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
          setImages((prevImages) => [...prevImages, { img, x: 100, y: 100, width: 100, height: 100, isFlipped: false }]);
        };
      });
    };

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
      if (selectedImageIndex !== null) {
        const selectedImage = images[selectedImageIndex];
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          selectedImage.img,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        const newImage = new Image();
        newImage.src = canvas.toDataURL();
        newImage.onload = () => {
          const updatedImages = [...images];
          updatedImages[selectedImageIndex] = { ...selectedImage, img: newImage };
          setImages(updatedImages);
        };
      }
    };

    const clearCanvas = () => {
      setLines([]);
      setShapes([]);
      setTexts([]);
      setImages([]);
    };

    const undoLast = () => {
      if (selectedTool === 'brush') {
        setLines(lines.slice(0, -1));
      } else if (selectedTool === 'rectangle' || selectedTool === 'circle') {
        setShapes(shapes.slice(0, -1));
      } else if (selectedTool === 'text') {
        setTexts(texts.slice(0, -1));
      } else if (selectedImageIndex !== null) {
        setImages(images.slice(0, -1));
      }
    };
const rotateImage = () => {
  if (selectedImageIndex !== null) {
    const updatedImages = [...images];
    const selectedImage = updatedImages[selectedImageIndex];

    // Set or increment the rotation angle (0, 90, 180, 270, etc.)
    selectedImage.rotation = (selectedImage.rotation || 0) + 90;

    // Reset to 0 if it reaches 360 to keep rotation within 0-359 degrees
    if (selectedImage.rotation === 360) {
      selectedImage.rotation = 0;
    }

    setImages(updatedImages);
  }
};


    const flipImage = (direction) => {
      if (selectedImageIndex !== null) {
        const updatedImages = [...images];
        updatedImages[selectedImageIndex].isFlipped = direction === 'horizontal' ? !updatedImages[selectedImageIndex].isFlipped : updatedImages[selectedImageIndex].isFlipped;
        setImages(updatedImages);
      }
    };


useEffect(() => {
  // Listen for incoming 'draw' events and update the canvas
  socket.on('draw', (data) => {
    if (data.tool === 'brush') {
      setLines((prevLines) => [...prevLines, data.line]);
    } else if (data.tool === 'rectangle' || data.tool === 'circle') {
      setShapes((prevShapes) => [...prevShapes, data.shape]);
    } else if (data.tool === 'text') {
      setTexts((prevTexts) => [...prevTexts, data.text]);
    }
  });

  return () => {
    socket.disconnect(); // Clean up connection on unmount
  };
}, []);

    return (
      <div className="flex h-screen bg-gray-800 text-white">
        {/* Left Sidebar for Drawing Tools */}
        <div className="w-1/6 bg-gray-900 p-4 space-y-4">
          <h2 className="text-lg font-bold mb-2">Draw</h2>
          <div className="flex flex-col space-y-2">
            {/* Tool selectors */}
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => setSelectedTool('brush')}>
              <Brush color={selectedTool === 'brush' ? 'yellow' : 'white'} size={24} />
              <span>Brush</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => setSelectedTool('eraser')}>
              <Eraser color={selectedTool === 'eraser' ? 'yellow' : 'white'} size={24} />
              <span>Eraser</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => setSelectedTool('rectangle')}>
              <Square color={selectedTool === 'rectangle' ? 'yellow' : 'white'} size={24} />
              <span>Rectangle</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => setSelectedTool('circle')}>
              <CircleIcon color={selectedTool === 'circle' ? 'yellow' : 'white'} size={24} />
              <span>Circle</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => setSelectedTool('text')}>
              <Type color={selectedTool === 'text' ? 'yellow' : 'white'} size={24} />
              <span>Text</span>
            </div>

            {/* Color picker */}
            <input
              type="color"
              // value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="p-2 w-full bg-gray-800 text-white rounded"
            />

            {/* Brush size slider */}
            {selectedTool === 'brush' && (
              <div className="flex flex-col space-y-1">
                <label className="text-sm">Brush Size</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-gray-400">{brushSize}px</span>
              </div>
            )}
          </div>
        </div>


        {/* Canvas Area */}
        <div className="flex-1 flex justify-center items-center bg-white">
          <Stage
            width={800}
            height={600}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            ref={stageRef}
            className="border border-gray-300 shadow-lg"
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={selectedTool === 'eraser' ? '#ffffff' : line.color}
                  strokeWidth={line.width}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation={selectedTool === 'eraser' ? 'destination-out' : 'source-over'}
                />
              ))}
              {shapes.map((shape, i) => {
                if (shape.type === 'rectangle') {
                  return (
                    <Rect
                      key={i}
                      x={shape.x}
                      y={shape.y}
                      width={shape.width}
                      height={shape.height}
                      fill={shape.color}
                    />
                  );
                } else if (shape.type === 'circle') {
                  return (
                    <Circle
                      key={i}
                      x={shape.x}
                      y={shape.y}
                      radius={shape.radius}
                      fill={shape.color}
                    />
                  );
                }
                return null;
              })}
              {texts.map((textItem, i) => (
                <KonvaText
                  key={i}
                  x={textItem.x}
                  y={textItem.y}
                  text={textItem.text}
                  fontSize={24}
                  fill={textItem.color}
                />
              ))}
              {images.map((imageItem, i) => (
                <KonvaImage
                  key={i}
                  image={
                  imageItem.img}
                  x={imageItem.x}
                  y={imageItem.y}
                  width={imageItem.width}
                  height={imageItem.height}
                  draggable
                  onClick={() => setSelectedImageIndex(i)}
                />
              ))}
            </Layer>
          </Stage>
        </div>

        {/* Right Sidebar for Actions */}
        <div className="w-1/6 bg-gray-900 p-4 space-y-4">
          <h2 className="text-lg font-bold mb-2">Actions</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center cursor-pointer space-x-2" onClick={clearCanvas}>
              <Trash2 size={24} color="white" />
              <span>Clear</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={undoLast}>
              <ArrowLeftCircle size={24} color="white" />
              <span>Undo</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={rotateImage}>
              <RotateCcw size={24} color="white" />
              <span>Rotate</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => flipImage('horizontal')}>
              <FlipHorizontal size={24} color="white" />
              <span>Flip Horizontal</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2" onClick={() => flipImage('vertical')}>
              <FlipVertical size={24} color="white" />
              <span>Flip Vertical</span>
            </div>
            <div className="flex items-center cursor-pointer space-x-2">
            <label htmlFor="file-upload" className="flex items-center space-x-2 cursor-pointer">
              <Upload size={24} color="white" />
              <span>Upload Image</span>
            </label>
            <input
              type="file"
              id="file-upload"
              onChange={handleImageUpload}
              className="hidden"
              name="file"
            />
          </div>

            <Button 
            label='Mint NFT' 
            className='w-[100px] bg-[#D42C2CB2] text-white fixed bottom-16 right-2' 
              onClick={() => { 
                mintNFT("0x7Cc7216b13283A0D07413D4C720971FEFBe42240", "QmExampleIPFSCID", connectWallet);
              // toast.success("NFT Minted Successfully")
              // window.location.replace("/");
            }} 
          />
          </div>
        </div>

        {/* Cropper for Image Cropping */}
        {croppingImage && (
          <Cropper
            image={croppingImage}
            crop={cropData}
            onCropChange={setCropData}
            onCropComplete={handleCropComplete}
          />
        )}

        {/* mint button */}
         
      </div>
    );
}

export default DrawingCanvas