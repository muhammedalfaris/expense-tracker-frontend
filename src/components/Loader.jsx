export default function SpinnerLoader() {
  return (
    <div className="relative w-10 h-10" style={{ perspective: '67.2px' }}>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="absolute w-full h-full bg-[#47ff71] left-1/2 origin-left"
          style={{
            animation: `spinnerAnimation 2s infinite ${index * 0.15}s`
          }}
        />
      ))}
      
      <style jsx>{`
        @keyframes spinnerAnimation {
          0% {
            transform: rotateY(0deg);
          }
          50%, 80% {
            transform: rotateY(-180deg);
          }
          90%, 100% {
            opacity: 0;
            transform: rotateY(-180deg);
          }
        }
      `}</style>
    </div>
  );
}