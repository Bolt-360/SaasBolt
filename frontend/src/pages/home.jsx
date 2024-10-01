import { Button } from "@/components/ui/button"
import { MountainIcon } from "@/icons"
import { Link } from "react-router-dom";
 const HomePage = () => {
    return (
        <div>
            <Link to="/auth">
                <Button>
                    <MountainIcon />
                    <span>No momento só temos a opção de login</span>
                </Button>
            </Link>
        </div>
    )
}

export default HomePage;
