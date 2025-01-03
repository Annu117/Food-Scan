export const prepareChartData = (nutrientData) => ({
    labels: nutrientData.map(item => item.label),
    datasets: [
      {
        data: nutrientData.map(item => item.value),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      },
    ],
  });
  
  export const drawBoundingBoxes = (canvasRef, imageSrc, detections = [], dimensions) => {
    if (!canvasRef.current || !imageSrc || !detections.length) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;
  
    img.onload = () => {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      detections.forEach(({ bbox: [x, y, width, height] = [] }) => {
        ctx.strokeRect(x || 0, y || 0, width || 0, height || 0);
      });
    };
  };
  
  