type CardProps = {
  title: string;
  description: string;
};

export function Card({ title, description }: CardProps) {
  return (
   <div className="rounded-1g border bg-white p-4 shadow-sm">
     <h3 className="font-semibold">{title}</h3>
     <p className="text-sm text-gray-600 mt-1">
       {description}
     </p>
   </div> 
  )
}