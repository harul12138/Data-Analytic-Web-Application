# web-application
wikipedia user analytics  
MVC structure - nodeJS express + mongodb mongoose + echart + mediawiki  
The main application logic is implemented in reserver.js  
entrance:‘localhost:3000’  
The overall_controller variable require the overall method defined in overall.controller.js in controllers. 
This controller requires the data and call the specific functions from revision.js in models and also updates the data of revisions via mediawiki API. 
With calling and executing the method defined in models, the method exported to routes renders a view template home.pug with the aggregated revison statistical data. 
The callback functions in controllers are nested because the closure feature of JavaScript variables.  
In order to ensure a single page style, we make all requests to render the home.pug view with different handlers.
As home.pug will receive the data from controllers via res.render(), so when point browser to ‘localhost:3000’,
the browser will render a home page with overall statistics and charts and individual articles select options to choose. 
When choose one title and click the button submit, the ajax wil get the value of the option and convey it to the individual url.  
use req.params.title to get the select title as we have the router ‘/user/:title’ which ‘title’ property mapped to. 
After getting the title, we can handle the rest functions calling from models(revision.js) of individual statistics and charts in indi.controller and user.controller which response and update the view page. 
Then the browser will render an updated home page to users.
