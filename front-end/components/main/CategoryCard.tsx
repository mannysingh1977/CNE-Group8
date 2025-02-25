import Image from 'next/image'

interface CategoryCardProps {
  name: string
  image: string
}

export function CategoryCard({ name, image }: CategoryCardProps) {
  return (
    <div className="w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <div className="p-2">
        <div className="relative aspect-square">
          <Image src={image} alt={name} layout="fill" objectFit="cover" className="rounded-md" />
        </div>
        <h3 className="mt-2 text-center text-xs sm:text-sm font-semibold truncate">{name}</h3>
      </div>
    </div>
  )
}

