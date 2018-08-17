var hash = {
   "meta" : {
      "server_ip" : "127.0.0.1",
      "domain_root" : "example.com",
      "domain_redirect" : "",
      "certificate" : "",
      "start_on_create" : false,
		"email" : "",
		"url_image_banner" : "",
		"left_name" : "Impressum",
		"url_left" : "",
		"right_name" : "Datenschutz",
		"url_right" : ""

   },
   "subdomains" : [
      { "sub" : "www" }, 
      { "sub" : "data" },  
      { "sub" : "analytics" },
   ],
   "images" : {
   		"haproxy" : {
   			"image_name" : "global-loadbalancer",
   			"docker_image" : "rancher/lb-service-haproxy",
   			"docker_version" : "v0.7.15"
   		},
   		"redirect-to-https" : {
   			"image_name" : "redirect-to-https",
   			"docker_image" : "a6b8/redirect-to-https-docker",
   			"docker_version" : "latest"
   		},
   		"redirect-to-url" : {
   			"image_name" : "redirect-to-url",
   			"docker_image" : "a6b8/redirect-to-url-docker",
   			"docker_version" : "latest"
   		},
   		"placeholder" : {
   			"image_name" : "placeholder-",
   			"docker_image" : "a6b8/placeholder-webpage-dockers",
   			"docker_version" : "latest"
   		}
   },
   "doms" : {
   	"meta" : {
	   	"offset_x" : 50,
	   	"offset_y" : 50 
	   },
	"on_screen_inputs" : [],
	"on_screen_yamls" : []
   },
   "yamls" : [
   		{ "name" : "rancher", "__txt" : "" },
   		{ "name" : "docker", "__txt" : "" }
      ]
}



function setup() {
	event_recreateYamls()
    draw_dom_init(hash)

    draw_inputFillValues(hash)
    event_setNewValuesToHash(hash)
    event_central(true)
}

function draw_getDomIds(obj) {
	var result = []
	var vals = Object.keys(obj["meta"])
	//console.log(Object.keys(obj["meta"]["placeholder"]))
	for(var i = 0; i < vals.length; i++) {
		var item = {
			"name" : vals[i],
			"dom_id" : i + "",
			"value" : obj["meta"][vals[i]]
		}
		result.push(item)
	}
	return result
}

function draw_dom_init(obj) {
	var vals = draw_getDomIds(obj)
	aa = createSpan("YAML GENERATOR - Loadbalancer")
	aa.position(obj["doms"]["meta"]["offset_x"],0)
	aa.style("font-family", "Oswald")
	aa.style("font-size", "20px")

	bb = createButton("DOWNLOAD");	
	bb.position(350,10)
	bb.id("download")
	document.getElementById("download").onclick = event_download;

	offset_y_total = 0
	offset_y_intern = 20

	for(var i = 0; i < vals.length; i++) {
		offset_y_total = i*offset_y_intern
		var a = createSpan(vals[i]["name"])
		var b = createInput();
		var c = createP();
		a.style("font-family", "Oswald")

		var y = i*offset_y_intern+10
		if(i > 1) { y = y + 20 }
		
		a.position(obj["doms"]["meta"]["offset_x"] + 0, obj["doms"]["meta"]["offset_y"] + y)

		b.style("font-family", "Arial")
		b.position(obj["doms"]["meta"]["offset_x"] + 250, obj["doms"]["meta"]["offset_y"] + y)
		b.id(vals[i]["dom_id"])
		b.input(event_central)
		var d = [a, b]
		obj["doms"]["on_screen_inputs"].push(d)
	}

 	var eee = createDiv("")
 	eee.size(300, offset_y_total +10)

	for(var i = 0; i < 2; i++) {
		var __txt = "docker"
		var e = createSpan(__txt)
		var f = createDiv("")
		f.child(e)
		f.style("background", "whitesmoke")
		e.id("yaml-" + i)
		obj["doms"]["on_screen_yamls"].push(f)
	}
	return result
}

function draw_inputFillValues(obj) {
	var vals = draw_getDomIds(obj)
	for(var i = 0; i < vals.length; i++) {
		document.getElementById(i).value = vals[i]["value"]
	}
}

function event_central(__init=false, t) {

	var id_current = 1000
	if(this.hasOwnProperty('elt')) {
		id_current  = this.elt.id *1
	}
  switch(true) {
  	case (id_current< 2 || __init):
  		var domain = document.getElementById(1).value
  		replace = [
  			"www." + domain,
  			"*." + domain,
  			"-1",
  			"hello@" + domain,
  			"https://init." + domain + "/company-banner-small.jpg",
  			"-1",
  			"https://www." + domain + "/impressum",
  			"-1",
  			"https://www." + domain + "/datenschutz"
  		]
  		for(var i = 0; i < replace.length; i++) {
  			dom_id = i + 2
  			if(replace[i] == "-1") {} else {
  				document.getElementById(dom_id).value = replace[i]
  			}
  			
  		}

  		break;
  	default:
  		break;
  }


  if (document.readyState === "complete") {
  	event_setNewValuesToHash()
  	event_recreateYamls() 
  	draw_recreateCodes()
  }
}

function event_setNewValuesToHash() {
	var vals = draw_getDomIds(hash)
	for(var i = 0; i < vals.length; i++) {
		id = vals[i]["dom_id"]
		val_new = document.getElementById(id).value
		hash["meta"][vals[i]["name"]] = val_new
	}
}

function event_recreateYamls() {
	services = new Set(rancher_lb_port_rules(hash)[1])
	services.add("redirect-to-url")
	hash["yamls"][0]["__txt"] = ""
	hash["yamls"][0]["__txt"] += rancher_lb(hash)
	hash["yamls"][0]["__txt"] += rancher_lb_port_rules(hash)[0]
	hash["yamls"][0]["__txt"] += rancher_redirects(hash, services)
	hash["yamls"][0]["__txt"] += rancher_services(hash, services)

    hash["yamls"][1]["__txt"] = ""
    hash["yamls"][1]["__txt"] += docker_lb(hash)
    hash["yamls"][1]["__txt"] += docker_services(hash, services)
}

function draw_recreateCodes() {
	for(var i = 0; i < hash["yamls"].length; i++) {
		var vals = {
			"code" : hash["yamls"][i]["__txt"]
		}
		var __txt = `
		<xmp>
{code}
</xmp>
`		
		var r = createStringFromTemplate(__txt, vals);
		document.getElementById("yaml-" + i).innerHTML = r
	}
}

function docker_service_other(obj, val) {
	var result = ""
	var vals = {
		"docker_image" : obj["images"][val]["docker_image"] + ":" + obj["images"][val]["docker_version"],
		"domain_redirect" : obj["meta"]["domain_redirect"]
	}
	switch(val) {
		case "redirect-to-https":
			var __txt = `
  redirect-to-https:
    image: {docker_image}`
			break;
		case "redirect-to-url":
			var __txt = `
  redirect-to-url:
    image: {docker_image}
    environment:
      - SERVER_REDIRECT_SCHEME=https
      - SERVER_REDIRECT={domain_redirect}`
			break;
	}
	result = createStringFromTemplate(__txt, vals);
	//console.log(result)
	return result
}

function docker_service_placeholder(obj, val) {
	var str = val.substring(val.indexOf("-")+1, val.length)
	var result = ""
    vals = {
    	"docker_image" : obj["images"]["placeholder"]["docker_image"] + ":" + obj["images"]["placeholder"]["docker_version"],
    	"service" : val,
		"pagetitle" : str.split("-").join("."),
		"headline" : str.split("-").join("."),
		"description" : "This Page is under Construction",
		"url_homepage" : obj["meta"]["domain_redirect"],
		"email" : obj["meta"]["email"],
		"url_image" : obj["meta"]["url_image_banner"],
		"url_footer_left_name" : obj["meta"]["left_name"],
		"url_footer_left" : obj["meta"]["url_left"],
		"url_footer_right_name" : obj["meta"]["right_name"],
		"url_footer_right" : obj["meta"]["url_right"]
  	}

  	var __txt = `
  {service}:
    image: {docker_image}
    environment:
      PAGETITLE: {pagetitle}
      HEADLINE: {headline}
      DESCRIPTION: {description}
      URL_HOMEPAGE: {url_homepage}
      EMAIL: {email}
      URL_IMAGE: {url_image}
      URL_FOOTER_LEFT_NAME: {url_footer_left_name}
      URL_FOOTER_LEFT: {url_footer_left}
      URL_FOOTER_RIGHT_NAME: {url_footer_right_name}
      URL_FOOTER_RIGHT: {url_footer_right}`;
	result = createStringFromTemplate(__txt, vals);
  	return result
}

function docker_services(obj, services) {
	var result = "";
	var vals_a = Array.from(services);
	for(var i = 0; i < vals_a.length; i++) {
		a = vals_a[i].indexOf(obj["images"]["placeholder"]["image_name"])
		if(a != -1) {
			result += docker_service_placeholder(obj, vals_a[i])
		} else {
			result += docker_service_other(obj, vals_a[i])
		}
	}
	return result
}

function docker_lb(obj) {
	var result = ""
	vals = {
		"image_name" : obj["images"]["haproxy"]["image_name"],
		"docker_image" : obj["images"]["haproxy"]["docker_image"] + ":" + obj["images"]["haproxy"]["docker_version"],
	}
	var __txt = `
version: '2'
services:
  image: {image_name}:
    {docker_image}
    - 443:443/tcp
    - 80:80/tcp`;
	result = createStringFromTemplate(__txt, vals);
	return result
}

function rancher_lb(obj, vals) {
	var vals = {
		"image_name" : obj["images"]["haproxy"]["image_name"],
		"certificate" : obj["meta"]["certificate"]
	}
	var result = ""
	var __txt = `
version: '2'
services:
  {image_name}:
    scale: 1
    start_on_create: true
    lb_config:
      certs: []
      default_cert: {certificate}
      port_rules:`;

	result = createStringFromTemplate(__txt, vals);
	return result
}

function rancher_services(obj, vals) {
	var result = ""
	var vals_a = Array.from(vals);
	for(var i = 0; i < vals_a.length; i++) {
		item = {
				"image_name" : vals_a[i],
				"start_on_create" : obj["meta"]["start_on_create"] + ""
			}
		result += rancher_service(obj, item)
	}
	return result
}

function rancher_service(obj, vals) {
	var result = ""
	var __txt = `
  {image_name}:
    scale: 1
    start_on_create: {start_on_create}`
	result = createStringFromTemplate(__txt, vals)
	return result
}

function rancher_redirects(obj, services) {
	var index = obj["subdomains"].length
	var result = ""
	vals = [
		obj["meta"]["server_ip"], obj["meta"]["domain_root"]
	]

	for(var i = 0; i < vals.length; i++) {
		result += rancher_redirect(obj, index, vals[i])
				index = index + 1
	}

	return result
}

function rancher_redirect(obj, index, val) {
	var vals = {
		"hostname" : val,
		"domain_redirect" : obj["meta"]["domain_redirect"],
		"index_1" : ((index*2) + 1),
		"index_2" : ((index*2) + 2),
		"redirect_docker" : obj["images"]["redirect-to-url"]["image_name"]
	}

	var result = ""
	var __txt = `
	  - hostname: {hostname}
	    priority: {index_1}
	    protocol: https
	    service: {redirect_docker}
	    source_port: 443
	    target_port: 80
	  - hostname: {hostname}
	    priority: {index_2}
	    protocol: http
	    service: {redirect_docker}
	    source_port: 80
	    target_port: 80`;

	result = createStringFromTemplate(__txt, vals)
	return result
}

function rancher_lb_port_rules(obj) {
	var result = []
	result[0] = ""
	result[1] = []
	for(var i = 0; i < obj["subdomains"].length; i++) {
		var index = i
		vals = {
			"hostname" : obj["subdomains"][index]["sub"] + "." + obj["meta"]["domain_root"].toString(),
			"placeholder_image_name" : obj["images"]["placeholder"]["image_name"] + obj["subdomains"][index]["sub"] + "-" + obj["meta"]["domain_root"].replace(".","-"),
			"redirect_name" : obj["images"]["redirect-to-https"]["image_name"]
		}
		r = rancher_lb_port_rule(index, vals)
		result[0] += r[0]
		result[1] = result[1].concat(r[1])
 	}
 	//result[1].push(obj["images"]["redirect-to-url"]["image_name"])
	return result
}

function rancher_lb_port_rule(index, vals) {   
	var __txt_1 = `
	  - hostname: {hostname}
	    priority: {priority}
	    protocol: https
	    service: {placeholder_image_name}
	    source_port: 443
	    target_port: 80`;
	var __txt_2 = `
	  - hostname: {hostname}
	    priority: {priority}
	    protocol: http
	    service: {redirect_name}
	    source_port: 80
	    target_port: 80`;

	render = {
		"texts" : [ __txt_1, __txt_2 ],
		"priority" : [((index*2) + 1), ((index*2) + 2)]
	}

	result = []
	result[0] = ""
	result[1] = [vals["placeholder_image_name"], vals["redirect_name"]] 
 
	for(var i = 0; i < render["texts"].length; i++) {
		c  = vals
		c["priority"]  = render["priority"][i]
		d = createStringFromTemplate(render["texts"][i], c);
		result[0] += d
	}
	return result
}

function createStringFromTemplate(template, variables) {
    return template.replace(new RegExp("\{([^\{]+)\}", "g"), function(_unused, varName){
        return variables[varName];
    });
}

function event_download() {
	var vals = {
		"rancher" : {
			"name" : "rancher-compose.yml",
			"content" : hash["yamls"][0]["__txt"]
		},
		"docker" : {
			"name" : "docker-compose.yml",
			"content" : hash["yamls"][1]["__txt"]
		},
	}

	var zip = new JSZip();
	zip.file(vals["rancher"]["name"], vals["rancher"]["content"]);
	zip.file(vals["docker"]["name"], vals["docker"]["content"]);

	//var img = zip.folder("docker-compose");
	zip.generateAsync({type:"blob"}).then(function(content) {
	    // see FileSaver.js
	    f = hash["meta"]["domain_root"]+"-yaml-loadbalancer.zip"
	    f = f.replace(".", "-")
	    saveAs(content, f);
	});
}
