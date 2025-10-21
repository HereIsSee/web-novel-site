import App from "../App";
import { TbStarFilled } from "react-icons/tb";
import Button from "../components/FormFields/Button";

const Chapter = () => {
  return (
    <App>
      <div className="chapter-header">
        <div className="title-author">
          <div>
            The Legend of William Oh <span>by</span>{" "}
            <span className="author">Macronomicon </span>
            <span className="stars">
              5
              <TbStarFilled
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginLeft: "4px",
                  marginTop: "-10px",
                }}
                size="50px"
              />
            </span>
          </div>
        </div>

        <div className="chapter-title">Chapter 189: Chasing a Bird</div>
        <Button styleType="blue-white" align="stretch">
          Fiction Page
        </Button>
        <Button styleType="red-white" align="stretch">
          Report Chapter
        </Button>
      </div>

      <div className="chapter-container card">
        <div className="chapter-buttons">
          <Button styleType="blue-white">Previous Chapter</Button>

          <Button styleType="blue-white">Next Chapter</Button>
        </div>

        <div className="chapter-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sed
            dolor euismod, rutrum arcu non, vestibulum massa. Sed mattis dui nec
            odio efficitur, in ullamcorper augue lacinia. Interdum et malesuada
            fames ac ante ipsum primis in faucibus. Nullam aliquam facilisis est
            vel pulvinar. In gravida felis bibendum diam volutpat finibus. Etiam
            imperdiet metus mauris, sed facilisis nibh accumsan eget. Aenean a
            fermentum nulla. Proin a feugiat urna. Mauris sagittis vel arcu ut
            ornare. Morbi egestas sem id augue euismod, vitae ullamcorper neque
            semper. Proin ultricies, velit quis commodo vestibulum, erat ex
            bibendum lacus, et mollis felis sem a erat. Nam quis vulputate quam.
          </p>

          <p>
            Donec placerat, ex nec commodo imperdiet, purus dui placerat diam,
            vel pulvinar lectus arcu sed neque. Pellentesque in magna augue.
            Aliquam porttitor, arcu et consequat consequat, leo neque vulputate
            ipsum, at vulputate massa nisl eu dui. In sit amet scelerisque
            neque, at semper neque. Proin vitae semper metus, nec consectetur
            libero. Etiam in neque porta neque condimentum interdum a a nisi.
            Morbi vel sapien pharetra, aliquet odio ac, porttitor turpis.
          </p>

          <p>
            Donec varius sodales justo, nec volutpat nunc viverra a. Donec in
            nulla vel purus tincidunt efficitur. Fusce fringilla et urna ac
            aliquet. Sed pharetra finibus dignissim. Fusce porttitor rhoncus
            felis ullamcorper pellentesque. Phasellus malesuada maximus nulla.
            Sed lacinia fermentum justo, sit amet sollicitudin elit dictum ut.
            Proin pellentesque massa a justo molestie vestibulum. Morbi purus
            est, elementum pulvinar massa quis, lobortis tristique velit. Proin
            commodo sem ut elit luctus, quis mattis mi consectetur. Suspendisse
            porttitor, enim non interdum tincidunt, odio eros vulputate tellus,
            mollis posuere lectus nisi in diam. Maecenas convallis massa sed
            vehicula vulputate. Nam ultrices vitae ipsum vitae ullamcorper.
            Phasellus ullamcorper pulvinar nunc, ac tristique nisi congue eu.
            Sed blandit ac magna vel efficitur.
          </p>

          <p>
            Sed semper tortor et massa sagittis tempor. Nunc varius mi eu
            volutpat malesuada. In bibendum dignissim urna, id consequat nisi
            eleifend at. Suspendisse potenti. Nullam a odio gravida, dictum quam
            vel, mattis diam. Ut ultrices dui vitae velit finibus, vitae
            imperdiet libero aliquet. Donec ut euismod orci. In mollis, tortor
            et finibus molestie, urna sapien faucibus ipsum, nec varius tellus
            tellus quis magna. Pellentesque augue mi, tempor accumsan nulla nec,
            fermentum elementum elit. Aliquam quis ullamcorper erat. Mauris
            scelerisque lacinia tortor ultrices aliquet.
          </p>

          <p>
            Mauris nec interdum dui, sit amet fringilla lectus. Nulla varius
            hendrerit iaculis. Ut sed auctor magna. Ut scelerisque, lacus vel
            finibus efficitur, lorem nisl vehicula leo, ut fermentum mi nibh a
            neque. Duis at ligula sed justo porttitor vehicula vitae luctus
            nulla. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam ullamcorper feugiat urna, ac venenatis ex volutpat et. Cras
            eu enim libero. Donec eleifend varius tortor, in dictum eros varius
            sagittis.
          </p>
        </div>

        <div className="chapter-buttons">
          <Button styleType="blue-white">Previous Chapter</Button>

          <Button styleType="blue-white">Fiction Index</Button>

          <Button styleType="blue-white">Next Chapter</Button>
        </div>
      </div>
    </App>
  );
};

export default Chapter;
