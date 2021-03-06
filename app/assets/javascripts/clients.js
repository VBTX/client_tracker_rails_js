$(document).ready(function() {
	listenForClick();
	listenForNewClientFormClick();
	listenForSearch();
});

function listenForClick() {
	let counter = 0;
	if (counter === 0) {
		$('button.js-more').on('click touchstart', function(e) {
			e.preventDefault();
			let clientId = e.currentTarget.dataset.id;
			fetch(`https://clienttracker123.herokuapp.com/clients/${clientId}.json`)
				.then(response => response.json())
				.then(data => {
					const show = document.getElementById('client-show');
					const client = new Client(data);
					let newForm = document.getElementById('newc');
					if (newForm) {
						newForm.style.display = 'none';
						show.innerHTML = client.clientHTML();
						$(this).attr('display', 'inline-block');
						hideMe();
					} else {
						show.innerHTML = client.clientHTML();
						$(this).attr('display', 'inline-block');
						hideMe();
					}
				});
		});
	} else {
		$('button.js-more').on('click touchstart', function() {
			e.preventDefault();
			const show = document.getElementById('client-show');
			show.innerHTML = '';
		});
		counter -= 1;
	}
}

class Client {
	constructor(obj) {
		this.id = obj.id;
		this.business_name = obj.business_name;
		this.website = obj.website;
		this.address = obj.address;
		this.email = obj.email;
		this.projects = obj.projects;
	}

	static newClientForm() {
		return `
		<form id="newc" style="display:inline-block">
		<strong>New Client Form</strong><br>
		<input id='client-business-name' type='text' name="client[business_name]" placeholder = "Business Name*" required></input>
		<input type='text' name="client[address]" placeholder = "Address"></input>
		<input type='text' name="client[website]" placeholder = "Website"</input>
		<input type='text' name="client[email]" placeholder = "Email"</input><br>
		<input type='submit' value= "SUBMIT" class="btn btn-success btn-md" />
		<button type="button" id="cancelMe" onclick="toggle('newc')" class="btn btn-danger btn-md" style="display:inline-block">CANCEL</button>
		</form>
		<br>
		
		`;
	}
}

function hideMe() {
	if (document.getElementById('client-show').innerHTML != '') {
		$('button#hide.btn.btn-danger.btn-md').on('click touchstart', function(e) {
			e.preventDefault();
			let clientView = document.getElementById('client-show');
			clientView.innerHTML = '';
		});
	} else {
		listenForClick();
	}
}

function toggle(divId) {
	let divN = document.getElementById(divId);
	// Toggle
	divN.style.display == 'inline-block'
		? (divN.style.display = 'none')
		: (divN.style.display = 'inline-block');
}

function projectData(data) {
	if (data.projects) {
		projectArr = [];
		data.projects.forEach(function(project) {
			projectArr.push(project.description);
		});
		return projectArr;
	} else {
		return `No projects at the moment`;
	}
}


function listenForNewClientFormClick() {
	$('button.js-new').on('click', function(e) {
		e.preventDefault();
		let newClientForm = Client.newClientForm();
		let place = document.getElementById('new-client');
		place.innerHTML = newClientForm;
		$('#newc').on('submit', function(e) {
			e.preventDefault();
			const values = $(this).serialize();
			$.post('/clients', values).done(function(data) {
				$('#thing').html('');
				let newClient = new Client(data);
				let placement = document.getElementById('thing');
				placement.innerHTML = newClient.clientHTML();

			});
		});
	})
};


Client.prototype.clientHTML = function() {
	return `
				<div class="client-show">
			 	<table class="table table-hover">
				<thead  class="table-active">	
				<tbody class="table-default" >
				<tr>
			 	<td>Business name: </td> <td>${this.business_name}</td>
			 	</tr>
			 	<tr>
			 	<td>Website: </td><td>${this.website}</td>
			 	</tr>
			 	<tr>
				<td>Email: </td><td>${this.email}</td>
				</tr>
				<tr>
				<td>Projects: </td><td>${projectData(this)}</td>
				</tr>
				<tr>
				<td>Address: </td><td>${this.address}</td>
				</tr>
				</tbody>
			</thead>
			</table>
				<div align=center>
				<div class="mapouter">
				<div class="gmap_canvas">
				<iframe width="399" height="271" id="gmap_canvas" src="https://maps.google.com/maps?q=${
					this.address
				}&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>Werbung: <a href="https://www.jetzt-drucken-lassen.de">jetzt-drucken-lassen.de</a></div><style>.mapouter{position:relative;text-align:right;height:271px;width:399px;}.gmap_canvas {overflow:hidden;background:none!important;height:271px;width:399px;}</style>
				</div>
				</div>
				</div>`
}


function listenForSearch() {
	let typingTimer;
	let doneTypingInterval = 500;
	$('#search').keyup(function() {
		clearTimeout(typingTimer);
		if ($('#search').val()) {
			typingTimer = setTimeout(doneTyping, doneTypingInterval);
		}
	});
	function doneTyping() {
		let input = $('#search')
			.val()
			.toLowerCase();
		let clientelle = Array.from(document.getElementsByTagName('h5'));
		let clientNames = [];

		if (clientelle.length >= 1) {
			for (let i = 0; i < clientelle.length; i++) {
				let name = clientelle[i].getElementsByTagName('li')[0].innerText;
				clientNames.push(name);
				if (name.toLowerCase().indexOf(input) > -1) {
					clientelle[i].style.display = '';
				} else {
					clientelle[i].style.display = 'none';
				}
			}
		}
	}
}
