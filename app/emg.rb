class EMG < Sinatra::Base
  
  helpers Sinatra::ContentFor2
  #register Sinatra::SimpleNavigation
  register Sinatra::Head
  register Sinatra::Flash
  
  set :views, File.join(File.dirname(File.dirname(__FILE__)),'views')
  set :public_path, File.join(File.dirname(File.dirname(__FILE__)), 'public')
  set :config_path, File.join(File.dirname(File.dirname(__FILE__)), 'config')
  set :run, false
  set :haml, :format => :html5, :attr_wrapper => '"'
  set :layout, true
  set :logging, true
  set :sessions, true
  set :session_secret, "1kA%@-y1MAS)f!@^a5et_^_!@^*@36a}"
  set :layout_default, :'layout'  
  set :stylesheet_path, '/css'
  set :javascript_path, '/js'
  set :stylesheet_splitter, ' | '
  
  #puts SimpleNavigation.root
  
  # set Rack
  #use Rack::ShowExceptions
  #use Rack::ContentLength
  use Rack::Static, :urls => [settings.stylesheet_path, settings.javascript_path, "/case-studies"], :root => 'public'
  
  # set the default stylesheets and javascripts
  stylesheets << "fonts.css"
  stylesheets << "css-reset.css"
  stylesheets << "style.css"
  stylesheets << "nosvg.css"
  stylesheets << "landscape.css | screen and (min-width:520px)"
  stylesheets << "tablet.css | screen and (min-width:760px)"
  stylesheets << "desktop.css | screen and (min-width:1004px)"
  #javascripts << "modernizr-2.5.3.min.js"
  javascripts << "jquery-1.7.2.min.js"
  javascripts << "jquery.easing.1.3.js"
  javascripts << "browser-upgrade.js"
  javascripts << "app-global.js"
  
  # set utf-8 for outgoing
  before do
    headers "Content-Type" => "text/html; charset=utf-8"
    @body_id = "default-app"
    @env = ENV['RACK_ENV']
    @uri = request.env["REQUEST_URI"]
    @aside = nil
    @nav = :"shared/nav"
    @case_studies = nil
  end
  
  configure :development do
    #stylesheets << "responsive.css"
    set :reload_templates, true
  end
  
  configure do
    # Email
    ActionMailer::Base.delivery_method = :smtp
    ActionMailer::Base.perform_deliveries = true
    ActionMailer::Base.smtp_settings = {
        :address => "smtp.gmail.com",
        :port => "587",
        :domain => "gmail.com",
        :enable_starttls_auto => true,
        :authentication => :login,
        :user_name => "admin@eonmediagroup.com",
        :password => "adminEONmedia"
    }
    ActionMailer::Base.raise_delivery_errors = true
  end
  
  get '/?' do
    title << "Complexity, simplified"
    @page_title = title.last
    @page_subtitle = "Online solutions &middot; Custom delivered"
    @body_id = "home"
    @aside = :"home/aside"
    javascripts << "app-home.js"
    get_case_studies
    v :"home/article"
  end
  
  get '/services/?' do
    title << "Services | EON Media Group"
    @page_title = "Services"
    @page_subtitle = "<span class=\"top\">Analyze and Plan</span><span class=\"middle\">Custom Build and Launch</span><span class=\"bottom\">Track and Adapt</span>"
    @body_id = "services"
    @aside = :"services/aside"
    #javascripts << "app-services.js"
    v :"services/article"
  end

  get '/success/?' do
    title << "Success | EON Media Group"
    @page_title = "Success"
    @page_subtitle = ""
    @body_id = "success"
    @aside = :"success/aside"
    javascripts << "app-success.js"
    get_case_studies
    v :"success/article"
  end

  get '/contact/?' do
    title << "Contact | EON Media Group"
    @page_title = "Contact"
    @page_subtitle = "Communication is key <span>in any working relationship</span>"
    @body_id = "contact"
    @aside = :"contact/aside"
    stylesheets << "jquery-ui-resizeable-1.8.21.css"
    javascripts << "jquery-ui-1.8.21.min.js"
    #javascripts << "jquery.example.min.js"
    javascripts << "app-contact.js"
    v :"contact/article"
  end
  
  get '/privacy/?' do
    title << "Privacy Policy | EON Media Group"
    @page_title = "Privacy Policy"
    @page_subtitle = ""
    @body_id = "privacy"
    v :"privacy/article"
  end
  
  get '/terms-conditions/?' do    
    title << "Terms and Conditions | EON Media Group"
    @page_title = "Terms & Conditions"
    @page_subtitle = ""
    @body_id = "terms-conditions"
    v :"terms-conditions/article"
  end

  post '/contact/?' do
    name = params[:name]
    email = params[:email]
    msg = {}
    email_regex = /^[^\.][-\w!#\$%&'\*\+\/=\?\^\`{\|}~\.]+[^\.$]@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/
    
    if name != "" && email != "" && (email_regex === email) then
      begin
        email_options = {}
        email_options[:from] = email
        email_options[:html_body] = haml :"email/html_email", :layout => false
        email_options[:text_body] = haml :"email/text_email", :layout => false
        # declared at the bottom of this class
        Mailman.contact(email_options).deliver
        msg[:success] = "Your message was sent successfully"
      rescue StandardError => e
        msg[:error] = {}
        msg[:error][:exception] = e
      end
    else
      msg[:error] = {}
      if email == "" then
        msg[:error][:email] = "Please fill out your email address"
      elsif !(email_regex === email)
        msg[:error][:email] = "Please enter a valid email address"
      end
      if name == "" then
        msg[:error][:name] = "Please fill out your name"
      end
    end
    msg.to_json
  end

  def v(template, options={}) 
    if !options[:layout] then
      options = options.merge(:layout => settings.layout_default)
    end
    if request.xhr? then 
      options[:layout] = false
    end
    haml(template, options) 
  end
  
  def get_case_studies
    if @case_studies == nil then
      parser = Yajl::Parser.new
      begin
        case_study_json = "#{settings.config_path}/case-studies.json"
        fileo = File.open(case_study_json)
        @case_studies = parser.parse(fileo)
      rescue StandardError => e
        @case_studies = {:error => "error #{e.to_s}"}
        #raise "#{settings.config_path}/case-studies.json"
      end
    end
  end
  
  not_found do
    title << "404 Not Found"
    @page_title = title.last
    v :"not_found", :layout => :'layout'
  end

  error do
    title << "50X Error"
    @page_title = title.last
    v :"error", :layout => :'layout'
  end
  
  class Mailman < ActionMailer::Base
    def contact(options)

      from = options[:from]
      html_body = options[:html_body]
      text_body = options[:text_body]

      mail(
        :to => "EON Media Group <info@eonmediagroup.com>",
        :from => "#{from}",
        :subject => "Contact Form Request"
      ) do |format|    
        format.text { text_body.to_s }
        format.html { html_body }
      end

    end
  end
end
  
  