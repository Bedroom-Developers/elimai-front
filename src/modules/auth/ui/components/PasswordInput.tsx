'use client'
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { forwardRef, useState } from "react"

interface PasswordInputProps extends React.ComponentProps<typeof Input> {

}
const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
    const [inputType, setInputType] = useState<'password' | 'text'>('password')
    const toggleInputType = () => {
        setInputType(inputType == 'password' ? 'text' : 'password')
    }
    return <section className="relative bg-white">
        <Input ref={ref}  {...props} type={inputType} />
        <Button type="button" className="absolute right-0 top-0" onClick={toggleInputType} size={'icon'} variant={'ghost'}>{inputType == 'password' ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}</Button>
    </section>
})
PasswordInput.displayName = 'PasswordInput'
export { PasswordInput }
