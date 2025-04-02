import React, {useContext} from 'react'
import noteContext from '../context/notes/noteContext';

const Noteitem = (props) => {
  const context = useContext(noteContext);
  const  {deleteNote} = context;
  const  {note, updateNote} = props;
  return (
    <div className='col-md-3'>
      <div className="card my-3">
        <div className="card-body">
            <div className='d-flex align-items.center'>
                <h5 className="card-title">{note.title}</h5>
                <i className="far fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id); props.showAlert("Deleted Successfully", "success")}} style={{color: "purple"}}></i>
                <i className="far fa-edit mx-2" onClick={()=>{updateNote(note)}} style={{color: "purple"}}></i>
            </div>
            <p className="card-text">{note.description}</p>
            {/* {note.file && <a href={`http://localhost:5000/${note.file}`} className="btn btn-primary mt-2 my-2" target="_blank" rel="noreferrer" style={{color: "white",backgroundColor: "purple", borderRadius: "4px"}}>Open in new Tab</a>} */}
            <br></br>
            
            {note.file && (
            <>
              {note.file.match(/\.(jpeg|jpg|gif|png)$/) && (
                <>
                <a
                    href={note.file}
                    download
                     className="btn btn-primary mt-2 my-2"
                     style={{color: "white",backgroundColor: "purple", borderRadius: "4px"}}
                  >
                    Download Image 
                  </a>
                  {note.file}
                  <img
                    src={note.file}
                    alt="Uploaded"
                    style={{ width: '100%', maxHeight: '100%' }}
                  />
                  
                </>
              )}
              {note.file.match(/\.(mp4|webm|ogg)$/) && (
                <>
                 <a
                    href={note.file}
                    download
                    className="btn btn-primary mt-2 my-2"
                    style={{color: "white",backgroundColor: "purple", borderRadius: "4px"}}
                  >
                    Download Video
                  </a>
                  <video controls style={{ width: '100%' }}>
                    <source src={note.file} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </>
              )}
              {note.file.match(/\.pdf$/) && (
                <>
                 <a
                    href={note.file}
                    download
                    className="btn btn-primary mt-2 my-2"
                    style={{color: "white",backgroundColor: "purple", borderRadius: "4px"}}
                  >
                    Download PDF
                  </a>
                  <iframe
                    src={note.file}
                    width="100%"
                    height="100%"
                    title="PDF Viewer"
                  ></iframe>
                </>
              )}
            </>

          )}
        </div>
      </div>
    </div>
  )
}

export default Noteitem

