/**
 * @jeyendra_assignment1
 * @author  Jeyendra Srinivas Datta Kanaparthi <jeyendra@buffalo.edu>
 * @version 1.0
 *
 * @section LICENSE
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License as
 * published by the Free Software Foundation; either version 2 of
 * the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * General Public License for more details at
 * http://www.gnu.org/copyleft/gpl.html
 *
 * @section DESCRIPTION
 *
 * This contains the main function. Add further description here....
 */
#include <iostream>
#include <stdio.h>
#include<string.h>
#include <stdlib.h>

#include<bits/stdc++.h>
#include <sys/socket.h>
#include <netdb.h>
#include <arpa/inet.h>
#include<unistd.h>
#include <sys/types.h>

#include "../include/global.h"
#include "../include/logger.h"

using namespace std;

/**
 * main function
 *
 * @param  argc Number of arguments
 * @param  argv The argument list
 * @return 0 EXIT_SUCCESS
 */


#define BACKLOG 5
#define STDIN 0
#define TRUE 1
#define MSG_SIZE 256
#define CMD_SIZE 256
#define BUFFER_SIZE 1000

char client_side_server_output[1000];

struct stats{
	string host_name;
	string status;
	int port_number;
	int sent_msgs;
	int recv_msgs;
};

map<string, struct stats> client_stats;

struct client_details{
	string status;
	int fd_num;
	char host_name[256];
	char ip_address[256];
	int port_number;
	map<string, bool> blocked_list;
};

vector<struct client_details> connected_clients;

int get_index_by_fd(int fd){
	for(int i=0;i<connected_clients.size();i++){
		if(connected_clients[i].fd_num == fd){
			return i;
		}
	}
	return -1;
}

int get_index_by_ip(char* ip){
	for(int i=0;i<connected_clients.size();i++){
		if(strcmp(connected_clients[i].ip_address, ip ) == 0){
			return i;
		}
	}
	return -1;
}

string get_hostname_by_ip(char* ip){
	string hostname="";
	for(int i=0;i<connected_clients.size();i++){
		if(strcmp(connected_clients[i].ip_address, ip) == 0){
			hostname = connected_clients[i].host_name;
			return hostname;
		}
	}
	return hostname;
}

bool is_valid_ip(char* ip_address){
	struct sockaddr_in test_sock;
	int is_valid = inet_pton(AF_INET, ip_address, &(test_sock.sin_addr));
	if(is_valid == 1){
		return true;
	}
	return false;
}

string getHostName(in_addr server_ipaddr){
    struct sockaddr_in serv;
    serv.sin_family = AF_INET;
    serv.sin_addr = server_ipaddr;
    char host_name[NI_MAXHOST];
    int name_info_ret = getnameinfo((struct sockaddr*)&serv, sizeof(serv), host_name, sizeof(host_name), NULL, 0, NI_NAMEREQD);
    if(name_info_ret){
        printf("%s", gai_strerror(name_info_ret));
        return "";
    }
	string node_name = host_name;
    return node_name;
}


bool sort_criteria(const client_details &client1, const client_details &client2){
	return client1.port_number <  client2.port_number;
}

bool sort_criteria_stats(const stats &client1,const stats &client2){
	return client1.port_number <  client2.port_number;
}

int check_ipaddr_connected_clients(char* ip){
	for(int i=0;i<connected_clients.size();i++){
		if(strcmp(connected_clients[i].ip_address, ip) == 0){
			return i;
		}
	}
	return -1;
}

bool starts_with(char* input, string comp){
	int i = 0;
	if(strlen(input) < comp.length()){
		return false;
	}
	while(input[i] != '\0' && i != comp.length()){
		if(input[i] != comp[i]){
			return false;
		}
		i++;
	}	
	return true;
}

void print_connected_clients(){
	for(int i=0;i<connected_clients.size();i++){
		cout << connected_clients[i].fd_num << endl;
		cout << connected_clients[i].ip_address << endl;
		cout << connected_clients[i].port_number << endl;
		cout << connected_clients[i].host_name << endl;
		cout << "++++++++++++++++++++++++++"<< endl;
		
	}
}

char* get_ip_address(){
	char* ip_adress  = (char*)malloc(100*sizeof(char));
	char name[100];
	gethostname(name, sizeof(name));
	char ip[100];
	hostent* nm =  gethostbyname(name);
	strcpy(ip, inet_ntoa(*((struct in_addr*)nm->h_addr)));
	return ip;
}	


char* generate_LIST_output(){
	char* output = (char*) malloc(3000*sizeof(char));
	memset(output, '\0', sizeof(output));
	sort(connected_clients.begin(), connected_clients.end(),sort_criteria);
	for(int i=0;i< connected_clients.size();i++){
		char temp[100];
		sprintf(temp, "%-5d%-35s%-20s%-8d\n" ,i+1, connected_clients[i].host_name, connected_clients[i].ip_address, connected_clients[i].port_number);
		strcat(output, temp);
	}
	// output[strlen(output)] = '/0';
	return output;
}


char* parse_server_list_response(char* server_response){
	// %%LIST_RESPONSE%%
	char* output = (char*) malloc(1024 * sizeof(char));
	memset(output, '\0', sizeof(output));
	int idx = 0;
	if(strlen(server_response) > 17){
		for(idx=0;idx<strlen(server_response);idx++){
			output[idx] = server_response[idx+17]; 
		}
	}
	return output;
}
void broadcast_message(char* message, int sender_fd){
	char sender_ip[30];
	char msg_to_send[500];
	memset(msg_to_send, '\0', 500);
	msg_to_send[0] = '1';
	int idx = get_index_by_fd(sender_fd);
	strcpy(sender_ip, connected_clients[idx].ip_address);
	// cout << "idx" << idx << "\n";
	// cout << "connected_clients.size()" << connected_clients.size() << "\n";
	for(int i=0;i<connected_clients.size();i++){
		string sender_ip_str = sender_ip;
		if(sender_fd != connected_clients[i].fd_num && connected_clients[i].blocked_list.find(sender_ip_str) == connected_clients[i].blocked_list.end()){
			char temp_msg[500];
			// cout << "sender_ip" << sender_ip;
			memset(temp_msg, '\0', 500);
			sprintf(temp_msg, "msg from:%s\n[msg]:%s\n", sender_ip, message);
			strcat(msg_to_send, temp_msg);
			if(send(connected_clients[i].fd_num, msg_to_send, strlen(msg_to_send), 0) > 0){
				// cout << "sent\n" ; 
			}
		}
	}
	cse4589_print_and_log("[%s:SUCCESS]\n", "RELAYED");
	cse4589_print_and_log("msg from:%s, to:%s\n[msg]:%s\n", sender_ip , "255.255.255", message);
	cse4589_print_and_log("[%s:END]\n", "RELAYED");
}


void start_server(char *port){

	int server_socket, head_socket, selret, sock_index, fdaccept=0;
    
	struct sockaddr_in client_addr;
	struct addrinfo hints, *res;
	fd_set master_list, watch_list;

	/* Set up hints structure */
	memset(&hints, 0, sizeof(hints));
    	hints.ai_family = AF_INET;
    	hints.ai_socktype = SOCK_STREAM;
    	hints.ai_flags = AI_PASSIVE;

	/* Fill up address structures */
	if (getaddrinfo(NULL, port, &hints, &res) != 0)
		perror("getaddrinfo failed");

	/* Socket */
	server_socket = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
	if(server_socket < 0)
		perror("Cannot create socket");
	
	/* Bind */
	if(bind(server_socket, res->ai_addr, res->ai_addrlen) < 0 )
		perror("Bind failed");

	freeaddrinfo(res);
	
	/* Listen */
	if(listen(server_socket, BACKLOG) < 0)
		perror("Unable to listen on port");
	
	/* ---------------------------------------------------------------------------- */
	
	/* Zero select FD sets */
	FD_ZERO(&master_list);
	FD_ZERO(&watch_list);
	
	/* Register the listening socket */
	FD_SET(server_socket, &master_list);
	/* Register STDIN */
	FD_SET(STDIN, &master_list);
	
	head_socket = server_socket;

	while(TRUE){
		memcpy(&watch_list, &master_list, sizeof(master_list));
		
		/* select() system call. This will BLOCK */
		selret = select(head_socket + 1, &watch_list, NULL, NULL, NULL);
		if(selret < 0)
			perror("select failed.");
		
		/* Check if we have sockets/STDIN to process */
		if(selret > 0){
			/* Loop through socket descriptors to check which ones are ready */
			for(sock_index=0; sock_index<=head_socket; sock_index+=1){
				
				if(FD_ISSET(sock_index, &watch_list)){
					
					/* Check if new command on STDIN */
					if (sock_index == STDIN){
						char *cmd = (char*) malloc(sizeof(char)*CMD_SIZE);
						
						memset(cmd, '\0', CMD_SIZE);
						if(fgets(cmd, CMD_SIZE-1, stdin) == NULL) //Mind the newline character that will be written to cmd
							exit(-1);
						
						if(starts_with(cmd, "AUTHOR")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "AUTHOR");
							cse4589_print_and_log("I, %s, have read and understood the course academic integrity policy.\n", "jeyendra");
							cse4589_print_and_log("[%s:END]\n", "AUTHOR");
						}
						else if(starts_with(cmd, "IP")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "IP");
							cse4589_print_and_log("IP:%s\n", get_ip_address());
							cse4589_print_and_log("[%s:END]\n", "IP");
						}
						else if(starts_with(cmd, "PORT")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "PORT");
							cse4589_print_and_log("PORT:%s\n", port);
							cse4589_print_and_log("[%s:END]\n", "PORT");
						}else if(starts_with(cmd, "LIST")){
							// sort(connected_clients.begin(), connected_clients.end(),sort_criteria);
							cse4589_print_and_log("[%s:SUCCESS]\n", "LIST");
							// for(int idx = 0;idx < connected_clients.size();idx++){
							// 	cse4589_print_and_log("%-5d%-35s%-20s%-8d\n", idx+1, connected_clients[idx].host_name, connected_clients[idx].ip_address, connected_clients[idx].port_number);
							// }
							char* list_output = generate_LIST_output();
							cse4589_print_and_log(list_output);
							free(list_output);
							cse4589_print_and_log("[%s:END]\n", "LIST");

						}else if(starts_with(cmd, "BLOCKED")){
							char cli_ip[30];
							memset(cli_ip, '\0', sizeof(cli_ip));
							for(int i=8;cmd[i]!= '\n';i++){
								cli_ip[i-8] = cmd[i];
							}
							// cout << cli_ip << "\n";
							if(is_valid_ip(cli_ip) == false ){
								// cout << "here";
								cse4589_print_and_log("[%s:ERROR]\n", "BLOCKED");
							}
							else{
								vector<string> ips;
								int flag = 0;
								for(int i=0;i<connected_clients.size();i++){
									if(strcmp(connected_clients[i].ip_address, cli_ip) == 0){
										// cout << "here" << "\n";
										flag = 1;
										map<string , bool>::iterator it;
										// cout << "new\n";
										for(it = connected_clients[i].blocked_list.begin(); it!=  connected_clients[i].blocked_list.end();it++){
											// cout << "it->first" << it->first << "\n";
											ips.push_back(it->first);
										}
									}
								}
								// cout << "ips";
								// for(int i=0;i<ips.size();i++){
								// 	// cout << ips[i] << "\n";
								// }
								if(flag == 0){
									cse4589_print_and_log("[%s:ERROR]\n", "BLOCKED");
								}
								else{
									vector<client_details> blocked_list_details;
									for(int i=0;i<ips.size();i++){
										for(int j=0;j<connected_clients.size();j++){
											char dummy[30];
											strcpy(dummy, ips[i].c_str());
											if(strcmp(dummy, connected_clients[j].ip_address) == 0){
												blocked_list_details.push_back(connected_clients[j]);
											}
										}
									}
									sort(blocked_list_details.begin(), blocked_list_details.end(), sort_criteria);
									cse4589_print_and_log("[%s:SUCCESS]\n", "BLOCKED");
									for(int i=0;i<blocked_list_details.size();i++){
										//connected_clients[i].host_name, connected_clients[i].ip_address, connected_clients[i].port_number);
										cse4589_print_and_log("%-5d%-35s%-20s%-8d\n", i+1, blocked_list_details[i].host_name,blocked_list_details[i].ip_address,blocked_list_details[i].port_number);
									}
								}
								
							}
							cse4589_print_and_log("[%s:END]\n", "BLOCKED");
							fflush(stdout);
							
						}else if(starts_with(cmd, "STATISTICS")){
							vector<stats> statistics;
							for(int i=0;i<connected_clients.size();i++){
								if(client_stats.find(connected_clients[i].host_name) != client_stats.end()){
									struct stats cli_stats;
									cli_stats.sent_msgs = client_stats[connected_clients[i].host_name].sent_msgs;
									cli_stats.recv_msgs = client_stats[connected_clients[i].host_name].recv_msgs;
									cli_stats.port_number = connected_clients[i].port_number;
									cli_stats.host_name = connected_clients[i].host_name;
									cli_stats.status = connected_clients[i].status;
									statistics.push_back(cli_stats);
								}
							}
							sort(statistics.begin(), statistics.end(), sort_criteria_stats);
							cse4589_print_and_log("[%s:SUCCESS]\n", "STATISTICS");
							for(int i=0;i<statistics.size();i++){
								cse4589_print_and_log("%-5d%-35s%-8d%-8d%-8s\n", i+1, statistics[i].host_name.c_str(), statistics[i].sent_msgs, statistics[i].recv_msgs, statistics[i].status.c_str());
							}
							cse4589_print_and_log("[%s:END]\n", "STATISTICS");
						}
						else if(starts_with(cmd, "EXIT")){
							// cout << cmd;
						}
						free(cmd);
					}
					/* Check if new client is requesting connection */
					else if(sock_index == server_socket){
						socklen_t caddr_len = sizeof(client_addr);
						fdaccept = accept(server_socket, (struct sockaddr *)&client_addr, &caddr_len);
                        
						if(fdaccept < 0)
							perror("Accept failed.");
						
						client_details new_client;
						inet_ntop(AF_INET, &client_addr.sin_addr, new_client.ip_address, INET_ADDRSTRLEN);
						string newhostname = getHostName(client_addr.sin_addr);
						int i=0;
						for(i=0;i<newhostname.length();i++){
							new_client.host_name[i] = newhostname[i];
						}
						new_client.host_name[i] = '\0';
						new_client.fd_num = fdaccept; 
						new_client.port_number = client_addr.sin_port; 
						new_client.status = "logged-in";
						int cidx = check_ipaddr_connected_clients(new_client.ip_address);
						// cout << "cidx" << cidx;
						if( cidx != -1){
							connected_clients[cidx] = new_client;
						}
						else{
							connected_clients.push_back(new_client);
						}
						// print_connected_clients();
						
						// add an entry to statistics map
						if(client_stats.find(newhostname) == client_stats.end()){
							stats newstats;
							newstats.sent_msgs = 0;
							newstats.recv_msgs = 0;
							client_stats[newhostname] = newstats;
						}	
						char list_output[1024] = "%%LIST_RESPONSE%%";
						strcat(list_output, generate_LIST_output());
						if(send(fdaccept, list_output, strlen(list_output), 0) > 0)
								// printf("sent list output!\n");
						fflush(stdout);

						/* Add to watched socket list */
						FD_SET(fdaccept, &master_list);
						if(fdaccept > head_socket) head_socket = fdaccept;
					}
					/* Read from existing clients */
					else{
						/* Initialize buffer to receieve response */
						char *buffer = (char*) malloc(sizeof(char)*BUFFER_SIZE);
						memset(buffer, '\0', BUFFER_SIZE);
						
						if(recv(sock_index, buffer, BUFFER_SIZE, 0) <= 0){
							close(sock_index);
							int idx = 0;
							for(idx=0;idx<connected_clients.size();idx++){
								if(sock_index == connected_clients[idx].fd_num){
									break;
								}
							}
							// remove entry in statistics
							client_stats.erase(connected_clients[idx].host_name);
							// remove client details in the connected clients list
							connected_clients.erase(connected_clients.begin()+idx);
							// printf("Remote Host terminated connection!\n");
							
							/* Remove from watched list */
							FD_CLR(sock_index, &master_list);
						}
						else {
							//Process incoming data from existing clients here ...
							char refresh_identify[50] = "%%REFRESH_LIST%%";
							// cout << "buffer" << buffer << "\n";
							fflush(stdout);

							if(strcmp(buffer, refresh_identify) == 0){
								char list_output[1024] = "%%LIST_RESPONSE%%";
								strcat(list_output, generate_LIST_output());
								if(send(sock_index, list_output, strlen(list_output), 0) > 0){
										// cout << list_output;
								}	
								else{
									printf("unable to send");
									fflush(stdout);
								}
							}else if(buffer[0] == '1'){
								char msg[1000] = "10";
								char* ip = (char*)malloc(100*sizeof(char));
								memset(ip,'\0', sizeof(ip));
								int index = 0;
								for(int i=1;buffer[i] != ' ';i++){
									ip[i-1] = buffer[i];
									index++;
								}
								char msg_to_send[1024];
								memset(msg_to_send, '\0', 1024);
								for(int i= index+1;buffer[i] != '\0';i++){
									msg_to_send[i-index-1]=buffer[i];
								}
								msg_to_send[strlen(msg_to_send) -1] = '\0';
								ip[index] = '\0';
								// cout << "msg_to_send" << msg_to_send << "\n";
								// print_connected_clients();
								int recv_fd=-1;
								for(int i=0;i<connected_clients.size();i++){
									if(strcmp(connected_clients[i].ip_address, ip) == 0){
										msg[1] = '1';
										recv_fd = connected_clients[i].fd_num;
									}
								}

								if(send(sock_index, msg, strlen(msg), 0) > 0){

								}
								if(msg[1] == '1'){
									char sender_ip[100];
									for(int i=0;i<connected_clients.size();i++){
										if(sock_index == connected_clients[i].fd_num){
											strcpy(sender_ip, connected_clients[i].ip_address);
											break;
										}
									}
									char final_message[1000];
									final_message[0] = '1';
									final_message[1] = '\0';
									char temp_msg[1000];

									sprintf(temp_msg, "msg from:%s\n[msg]:%s\n", sender_ip, msg_to_send);
									strcat(final_message, temp_msg);
									// cout << "final_message\n" << final_message << "\n" ;
									// cse4589_print_and_log("%s", final_message);
									
									int idx = get_index_by_ip(ip);
									string sender_ip_str = sender_ip;
									// cout << "sender_ip_str" << sender_ip_str ;
									// cout << "connected_clients[idx].blocked_list" << connected_clients[idx].blocked_list.size() << "\n";
									// cout << "idx" << idx << "\n";
									// for(map<string, bool>::iterator it=connected_clients[idx].blocked_list.begin();it!= connected_clients[idx].blocked_list.end();it++){
									// 	cout << "it->first" << it->first << "\n";
									// }
									// cout << "ip" << ip << "\n";
									// cout << "sender_ip" << sender_ip << "\n";
									if(connected_clients[idx].blocked_list.find(sender_ip_str) == connected_clients[idx].blocked_list.end() && connected_clients[idx].status != "logged-out"){
										cse4589_print_and_log("[%s:SUCCESS]\n", "RELAYED");
										cse4589_print_and_log("msg from:%s, to:%s\n[msg]:%s\n", sender_ip , ip, msg_to_send);
										cse4589_print_and_log("[%s:END]\n", "RELAYED");
										if(send(recv_fd, final_message, sizeof(final_message), 0 ) > 0){
											// cse4589_print_and_log();
										}
										string sender_hostname = get_hostname_by_ip(sender_ip);
										string recv_hostname = get_hostname_by_ip(ip);
										// cout << "sender_hostname" << sender_hostname << "\n";
										// cout << "recv_hostname" << recv_hostname << "\n";
										client_stats[sender_hostname].sent_msgs++;
										client_stats[recv_hostname].recv_msgs++;
									}
								}
							}else if(buffer[0] == '2'){
								// broadcast
								// cout << "buffer" << buffer << "\n";
								char message[500];
								memset(message, '\0', 500);
								for(int i=1;buffer[i] != '\0';i++){
									message[i-1]=buffer[i];
								}
								message[strlen(message)-1] = '\0';
								broadcast_message(message, sock_index);
							}else if(buffer[0] == '3'){
								// block
								// 
								char blocked_ip[30];
								memset(blocked_ip, '\0', 30);
								char msg_to_send[10] = "3";
								for(int i=1;buffer[i]!= '\0';i++){
									blocked_ip[i-1] = buffer[i];
								}
								// cout << "blocked_ip" << blocked_ip << "\n";
								int flag = 1;
								bool present_ip = false;
								for(int i=0;i<connected_clients.size();i++){
									if(strcmp(blocked_ip, connected_clients[i].ip_address) == 0){
										// cout << "here";
										present_ip = true;
									}
								}
								if(present_ip == true){
									int idx = get_index_by_fd(sock_index);
									// cout << "\nidx" << idx ;
									// cout << "blocked_ip" << blocked_ip<< "\n";
									string ips = blocked_ip;

									for(map<string, bool>::iterator itp = connected_clients[idx].blocked_list.begin() ; itp != connected_clients[idx].blocked_list.end() ; itp++){
										// cout << "itp->first" << itp->first << "\n";
									}
									if(idx != -1){
										if(connected_clients[idx].blocked_list.find(ips) == connected_clients[idx].blocked_list.end()){
											msg_to_send[1] = '1';
											flag = 0;
											// cout << "here" ;
											connected_clients[idx].blocked_list[ips] = true;
										}
									}
								}
								if(flag == 1){
									msg_to_send[1] = '0';
								}
								if(send(sock_index, msg_to_send, strlen(msg_to_send), 0) > 0){

								}
							} else if(buffer[0] == '4'){
								// unblock 
								char msg_to_send[10];
								memset(msg_to_send, '\0', 10);
								msg_to_send[0]='4';
								string unblock_ip;
								for(int i=1;buffer[i] != '\0';i++){
									unblock_ip += buffer[i];
								} 
								// cout << "unblock_ip" << unblock_ip << "\n"; 
								int idx = get_index_by_fd(sock_index);
								// cout << "idx" << idx << "\n";
								if(connected_clients[idx].blocked_list.find(unblock_ip) != connected_clients[idx].blocked_list.end()){
									msg_to_send[1]= '1';
									connected_clients[idx].blocked_list.erase(unblock_ip);
								}else{
									msg_to_send[1] = '0';
								}
								// cout << "msg_to_send" << msg_to_send; 
								if(send(sock_index, msg_to_send, 10, 0 ) > 0){

								}
							}else if(buffer[0] = '0'){
								//log out
								int idx = get_index_by_fd(sock_index); 
								// changed the status 
								connected_clients[idx].status = "logged-out";
								FD_CLR(sock_index, &master_list);
							}
							fflush(stdout);
						}
						
						free(buffer);
					}
				}
			}
		}
	}

}
void start_server1(char *p){
	
	int server_socket, head_socket, selret, sock_index, fdaccept=0;
    
	struct sockaddr_in client_addr;
	struct addrinfo hints, *res;
	fd_set master_list, watch_list;

	/* Set up hints structure */
	memset(&hints, 0, sizeof(hints));
    	hints.ai_family = AF_INET;
    	hints.ai_socktype = SOCK_STREAM;
    	hints.ai_flags = AI_PASSIVE;

	/* Fill up address structures */
	if (getaddrinfo(NULL, p, &hints, &res) != 0)
		perror("getaddrinfo failed");

	/* Socket */
	server_socket = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
	if(server_socket < 0)
		perror("Cannot create socket");
	
	/* Bind */
	if(bind(server_socket, res->ai_addr, res->ai_addrlen) < 0 )
		perror("Bind failed");

	freeaddrinfo(res);
	
	/* Listen */
	if(listen(server_socket, BACKLOG) < 0)
		perror("Unable to listen on port");
	
	/* ---------------------------------------------------------------------------- */
	
	/* Zero select FD sets */
	FD_ZERO(&master_list);
	FD_ZERO(&watch_list);
	
	/* Register the listening socket */
	FD_SET(server_socket, &master_list);
	/* Register STDIN */
	FD_SET(STDIN, &master_list);
	
	head_socket = server_socket;
	
	while(TRUE){
		memcpy(&watch_list, &master_list, sizeof(master_list));
		
		//printf("\n[PA1-Server@CSE489/589]$ ");
		//fflush(stdout);
		
		/* select() system call. This will BLOCK */
		selret = select(head_socket + 1, &watch_list, NULL, NULL, NULL);
		if(selret < 0)
			perror("select failed.");
		
		/* Check if we have sockets/STDIN to process */
		if(selret > 0){
			/* Loop through socket descriptors to check which ones are ready */
			for(sock_index=0; sock_index<=head_socket; sock_index+=1){
				
				if(FD_ISSET(sock_index, &watch_list)){
					
					/* Check if new command on STDIN */
					if (sock_index == STDIN){
						char *cmd = (char*) malloc(sizeof(char)*CMD_SIZE);
						
						memset(cmd, '\0', CMD_SIZE);
						if(fgets(cmd, CMD_SIZE-1, stdin) == NULL) //Mind the newline character that will be written to cmd
							exit(-1);
						
						// printf("\nI got: %s\n", cmd);
						
						//Process PA1 commands here ...
						
						free(cmd);
					}
					/* Check if new client is requesting connection */
					else if(sock_index == server_socket){
						socklen_t caddr_len = sizeof(client_addr);
						fdaccept = accept(server_socket, (struct sockaddr *)&client_addr, &caddr_len);
                        
						if(fdaccept < 0)
							perror("Accept failed.");
						
						printf("\nRemote Host connected!\n");  
						char ip_addr[1024]; 
						inet_ntop(AF_INET, &client_addr.sin_addr, ip_addr, INET_ADDRSTRLEN);
						// cout << ip_addr << "*";
						// cout << getHostName(client_addr.sin_addr) << "*" << endl;
						// cout << client_addr.sin_port << "*";
						
						/* Add to watched socket list */
						FD_SET(fdaccept, &master_list);
						if(fdaccept > head_socket) head_socket = fdaccept;
					}
					/* Read from existing clients */
					else{
						/* Initialize buffer to receieve response */
						char *buffer = (char*) malloc(sizeof(char)*BUFFER_SIZE);
						memset(buffer, '\0', BUFFER_SIZE);
						
						if(recv(sock_index, buffer, BUFFER_SIZE, 0) <= 0){
							close(sock_index);
							printf("Remote Host terminated connection!\n");
							
							/* Remove from watched list */
							FD_CLR(sock_index, &master_list);
						}
						else {
							//Process incoming data from existing clients here ...
							
							
							if(send(fdaccept, buffer, strlen(buffer), 0) == strlen(buffer))
								printf("Done!\n");
							fflush(stdout);
						}
						
						free(buffer);
					}
				}
			}
		}
	}

}

int connect_to_host(char *server_ip, char* server_port, char* port ){
	int fdsocket;
	struct addrinfo hints, *res;
	struct sockaddr_in client_addr_info;
	/* Set up hints structure */	
	memset(&hints, 0, sizeof(hints));
	hints.ai_family = AF_INET;
	hints.ai_socktype = SOCK_STREAM;

	/* Fill up address structures */	
	if (getaddrinfo(server_ip, server_port, &hints, &res) != 0)
		perror("getaddrinfo failed");

	/* Socket */ 
	fdsocket = socket(res->ai_family, res->ai_socktype, res->ai_protocol);
	if(fdsocket < 0)
		perror("Failed to create socket");

	memset(&client_addr_info, 0 , sizeof(client_addr_info));
	client_addr_info.sin_family = res->ai_family;
	client_addr_info.sin_addr.s_addr = htonl(INADDR_ANY);
	client_addr_info.sin_port = atoi(port);
	// cout << atoi(port) << endl;
	int flag = 1;
	if(setsockopt(fdsocket, SOL_SOCKET, SO_REUSEADDR, &flag, sizeof(flag)) < 0){
		// cout << "SETSOCKOP FAILED";
	}
	if(setsockopt(fdsocket, SOL_SOCKET, SO_REUSEPORT, &flag, sizeof(flag)) < 0){
		// cout << "SETSOCKOP FAILED port";
	}
	if(bind(fdsocket,(struct sockaddr*)&client_addr_info, sizeof(client_addr_info)) < 0 ){
		perror("bind failed");
		return -1;
	}


	/* Connect */
	if(connect(fdsocket, res->ai_addr, res->ai_addrlen) < 0)
		perror("Connect failed");
	
	freeaddrinfo(res);

	return fdsocket;
}

char** parse_login_ip_port(char* command){
	// declaration of ip,port 
	char** ip_port = (char**)malloc(2*sizeof(char*));
	for(int i=0;i<2;i++){
		ip_port[i] = (char*)malloc(20*sizeof(char));
	}
	int idx = 0;
	char* tokens = strtok(command, " ");
	tokens = strtok(NULL," ");
	while ( tokens != NULL ){
		strcpy(ip_port[idx], tokens);
		tokens = strtok(NULL, " ");
		idx++;
	}
	for(int i=0;i<strlen(ip_port[1]);i++){
		if(ip_port[1][i] == '\n'){
			ip_port[1][i] = '\0';
		}
	}
	return ip_port;
}

char*  get_sender_ip(char* msg){
	char* ip = (char*)malloc(20*sizeof(char));
	char* tokens = strtok(msg, " ");
	tokens= strtok(NULL, " ");
	strcpy(ip, tokens);
	return ip;
}



bool is_valid_port(char* port){
	int port_number = 0;
	for(int i=0;port[i] != '\0' ; i++){
		if(port[i] >= '0' && port[i] <= '9'){
			port_number*=10;
			port_number+= (port[i] - '0');
		}else{
			return false;
		}
	}
	
	if(port_number >= 1024 && port_number <= 65535){
		return true;
	}
	return false;
}

void start_client_modified(char* port){
	int server = -1, head_socket, selret, sock_index;
	fd_set master_list, watch_list;
	FD_ZERO(&master_list);
	FD_ZERO(&watch_list);	
	FD_SET(STDIN, &master_list);
	fflush(stdout);
	/* setting as 0 because we only have stdin in the watch list*/
	head_socket = 0;
	while(TRUE){
		memcpy(&watch_list, &master_list, sizeof(master_list));
		/* select() system call. This will BLOCK */
		selret = select(head_socket + 1, &watch_list, NULL, NULL, NULL);
		if(selret < 0)
			perror("select failed.");
		if(selret > 0){
			/* Loop through socket descriptors to check which ones are ready */
			for(sock_index=0; sock_index<=head_socket; sock_index+=1){
				if(FD_ISSET(sock_index, &watch_list)){
					/* Check if new command on STDIN */
					if (sock_index == STDIN){
						char *cmd = (char*) malloc(sizeof(char)*CMD_SIZE);
						memset(cmd, '\0', CMD_SIZE);
						// if(fgets(cmd, CMD_SIZE-1, stdin) == NULL){
						// 	exit(-1);
						// }
						read(0, cmd, 256); 
						if(starts_with(cmd, "AUTHOR")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "AUTHOR");
							cse4589_print_and_log("I, %s, have read and understood the course academic integrity policy.\n", "jeyendra");
							cse4589_print_and_log("[%s:END]\n", "AUTHOR");
						}
						else if(starts_with(cmd, "IP")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "IP");
							cse4589_print_and_log("IP:%s\n", get_ip_address());
							cse4589_print_and_log("[%s:END]\n", "IP");
						}
						else if(starts_with(cmd, "PORT")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "PORT");
							cse4589_print_and_log("PORT:%s\n", port);
							cse4589_print_and_log("[%s:END]\n", "PORT");
						}else if(starts_with(cmd, "LIST")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "LIST");
							cse4589_print_and_log(client_side_server_output);
							cse4589_print_and_log("[%s:END]\n", "LIST");
							fflush(stdout);
						}else if(starts_with(cmd, "LOGIN")){
							char** ip_port = parse_login_ip_port(cmd);
							if(!is_valid_ip(ip_port[0]) || !is_valid_port(ip_port[1])){
								cse4589_print_and_log("[%s:ERROR]\n", "LOGIN");
							}
							else{
								server = connect_to_host(ip_port[0], ip_port[1], port);
								if(server < 0){
									cse4589_print_and_log("[%s:ERROR]\n", "LOGIN");
								}else{
									cse4589_print_and_log("[%s:SUCCESS]\n", "LOGIN");
									FD_SET(server, &master_list);
									if(head_socket< server){
										head_socket = server;
									}
								}
							}
							cse4589_print_and_log("[%s:END]\n", "LOGIN");
							fflush(stdout);
						}else if(starts_with(cmd, "REFRESH")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "REFRESH");
							char msg[100] = "%%REFRESH_LIST%%";
							if(send(server, msg, strlen(msg), 0) > 0 ){
								// printf("request sent");
							}
							cse4589_print_and_log("[%s:END]\n", "REFRESH");
							fflush(stdout);
						}
						else if(starts_with(cmd, "SEND")){
							char cmd1[100];
							strcpy(cmd1, cmd);
							char msg[256] = "1";
							char* ip = get_sender_ip(cmd1);
							if(!is_valid_ip(ip)){
								cse4589_print_and_log("[%s:ERROR]\n", "SEND");
							}
							else{
								for(int i=5;cmd[i]!= '\0';i++){
									msg[i-4]=cmd[i];
								}
								if(send(server, msg, strlen(msg), 0) > 0){
									// printf("sent success");
								}
								char buffer[1000];
								if(recv(server, buffer, 1000, 0) < 0){
									printf("Remote Host terminated connection!\n");
								}else{
									if(buffer[1] == '1'){
										cse4589_print_and_log("[%s:SUCCESS]\n", "SEND");
									}else{
										cse4589_print_and_log("[%s:ERROR]\n", "SEND");
									}
								}
							}
							cse4589_print_and_log("[%s:END]\n", "SEND");
							fflush(stdout);
						}
						else if(starts_with(cmd, "EXIT")){
							cse4589_print_and_log("[%s:SUCCESS]\n", "EXIT");
							int close_ret = close(server);
							cse4589_print_and_log("[%s:END]\n", "EXIT");
							exit(0);
						}
						else if(starts_with(cmd, "BROADCAST")){
							char msg[300] = "2";
							int i=0;
							for(i=10;cmd[i]!= '\0';i++){
								msg[i-9] = cmd[i];
							}
							msg[i-9] = '\0';
							if(send(server, msg, strlen(msg), 0) > 0 ){
								cse4589_print_and_log("[%s:SUCCESS]\n", "BROADCAST");	
							}else{
								cse4589_print_and_log("[%s:ERROR]\n", "BROADCAST");
							}
							cse4589_print_and_log("[%s:END]\n", "BROADCAST");
						}
						else if(starts_with(cmd, "BLOCK")){
							char block_ip[30];
							memset(block_ip, '\0', sizeof(block_ip));
							for(int i=6;cmd[i]!= '\n';i++){
								block_ip[i-6] = cmd[i];
							}
							char msg[50]="3";
							strcat(msg, block_ip);
						 	// cout << "block_ip" << block_ip << "\n";
							if(!is_valid_ip(block_ip)){
								cse4589_print_and_log("[%s:ERROR]\n", "BLOCK");								
							}
							else{
								if(send(server, msg, strlen(msg), 0 ) > 0){
									// cout << "msg" << msg << "\n";
									// cout << "sent" << "\n";
								}
								char buffer[10];
								if(recv(server, buffer, 10, 0) < 0){
									printf("Remote Host terminated connection!\n");
								}else{
									// cout << "buffer" << buffer << "\n";
									if(buffer[1] == '1'){
										cse4589_print_and_log("[%s:SUCCESS]\n", "BLOCK");
									}else{
										cse4589_print_and_log("[%s:ERROR]\n", "BLOCK");
									}
								}
							}
							cse4589_print_and_log("[%s:END]\n", "BLOCK");
							fflush(stdout);
						}else if(starts_with(cmd,"UNBLOCK")){
							char unblock_ip[30];
							memset(unblock_ip, '\0', 30);
							for(int i=8;cmd[i]!= '\n';i++){
								unblock_ip[i-8]  = cmd[i]; 
							}
							if(!is_valid_ip(unblock_ip)){
								cse4589_print_and_log("[%s:ERROR]\n", "UNBLOCK");
							}else{
								char msg[30];
								memset(msg, '\0', 30);
								msg[0] = '4';
								strcat(msg, unblock_ip);
								// cout << "msg" << msg << "\n";
								if(send(server, msg, strlen(msg), 0) > 0){

								}
								char buffer[10];
								memset(buffer, '\0', 10);
								if(recv(server, buffer, 10, 0) < 0 ){
									// cout << "connection closed \n";
								}
								else{
									// cout << "buffer "<< buffer << "\n";
									if(buffer[1] == '1'){
										cse4589_print_and_log("[%s:SUCCESS]\n", "UNBLOCK");
									}else{
										cse4589_print_and_log("[%s:ERROR]\n", "UNBLOCK");
									}
								}
							}
							cse4589_print_and_log("[%s:END]\n", "UNBLOCK");
							fflush(stdout);
						}else if(starts_with(cmd, "LOGOUT")){
							char msg[5];
							memset(msg, '\0', 5);
							msg[0]= '0';
							if(send(server, msg, 5, 0) > 0){

							}
							FD_CLR(server, &master_list);
							close(server);
							cse4589_print_and_log("[%s:SUCCESS]\n", "LOGOUT");
							cse4589_print_and_log("[%s:END]\n", "LOGOUT");
						}
						free(cmd);
					}
					/* Read from existing clients */
					else{
						/* Initialize buffer to receieve response */
						char *buffer = (char*) malloc(sizeof(char)*BUFFER_SIZE);
						memset(buffer, '\0', BUFFER_SIZE);
						if(recv(sock_index, buffer, BUFFER_SIZE, 0) <= 0){
							close(sock_index);
							printf("Remote Host terminated connection!\n");
							/* Remove from watched list */
							FD_CLR(sock_index, &master_list);
						}
						else {
							//Process incoming data from existing clients here ...
							fflush(stdout);
							if(starts_with(buffer, "%%LIST_RESPONSE%%")){
								memset(client_side_server_output, '\0', sizeof(client_side_server_output));
								strcpy(client_side_server_output, parse_server_list_response(buffer));
							}else if(buffer[0] == '1' ){
								cse4589_print_and_log("[%s:SUCCESS]\n", "RECEIVED");
								for(int i=1;buffer[i] != '\0' ;i++){
									cse4589_print_and_log("%c", buffer[i]);
								}
								cse4589_print_and_log("[%s:END]\n", "RECEIVED");
								fflush(stdout);
							}
						}
						free(buffer);
					}
				}
			}
		}
	}	
}



void start_client(char* port){

	int server = -1;
	while(TRUE){
		char *cmd = (char*) malloc(sizeof(char)*MSG_SIZE);
		memset(cmd, '\0', MSG_SIZE);
		if(fgets(cmd, MSG_SIZE-1, stdin) == NULL) //Mind the newline character that will be written to msg
			exit(-1);

		if(starts_with(cmd, "AUTHOR")){
			cse4589_print_and_log("[%s:SUCCESS]\n", "AUTHOR");
			cse4589_print_and_log("I, %s, have read and understood the course academic integrity policy.\n", "jeyendra");
			cse4589_print_and_log("[%s:END]\n", "AUTHOR");
		}
		else if(starts_with(cmd, "IP")){
			cse4589_print_and_log("[%s:SUCCESS]\n", "IP");
			cse4589_print_and_log("IP:%s\n", get_ip_address());
			cse4589_print_and_log("[%s:END]\n", "IP");
		}
		else if(starts_with(cmd, "PORT")){
			cse4589_print_and_log("[%s:SUCCESS]\n", "PORT");
			cse4589_print_and_log("PORT:%s\n", port);
			cse4589_print_and_log("[%s:END]\n", "PORT");
		}else if(starts_with(cmd, "LIST")){
			cse4589_print_and_log("[%s:SUCCESS]\n", "LIST");
			cse4589_print_and_log(client_side_server_output);
			cse4589_print_and_log("[%s:END]\n", "LIST");
			fflush(stdout);
		}else if(starts_with(cmd, "LOGIN")){
			char** ip_port = parse_login_ip_port(cmd);
			if(!is_valid_ip(ip_port[0]) || !is_valid_port(ip_port[1])){
				cse4589_print_and_log("[%s:ERROR]\n", "LOGIN");
			}
			else{
				server = connect_to_host(ip_port[0], ip_port[1], port);
				if(server < 0){
					cse4589_print_and_log("[%s:ERROR]\n", "LOGIN");
				}else{
					cse4589_print_and_log("[%s:SUCCESS]\n", "LOGIN");
				}
				char *buffer = (char*) malloc(sizeof(char)*BUFFER_SIZE);
				memset(buffer, '\0', BUFFER_SIZE);
				if(recv(server, buffer, BUFFER_SIZE, 0) > 0){
					if(starts_with(buffer, "%%LIST_RESPONSE%%")){
						memset(client_side_server_output, '\0', sizeof(client_side_server_output));
						strcpy(client_side_server_output, parse_server_list_response(buffer));
					}
				}
				free(buffer);
			}
			cse4589_print_and_log("[%s:END]\n", "LOGIN");
		}else if(starts_with(cmd, "REFRESH")){

			char msg[100] = "%%REFRESH_LIST%%";
			if(send(server, msg, strlen(msg), 0) < 0 ){
				perror("request NOT sent");
			}
			char *buffer = (char*) malloc(sizeof(char)*BUFFER_SIZE);
			memset(buffer, '\0', BUFFER_SIZE);
			if(recv(server, buffer, BUFFER_SIZE, 0) > 0){
				memset(client_side_server_output, '\0', sizeof(client_side_server_output));
				strcpy(client_side_server_output, parse_server_list_response(buffer));
				cse4589_print_and_log("[%s:SUCCESS]\n", "REFRESH");
			}else{
				cse4589_print_and_log("[%s:ERROR]\n", "REFRESH");				
			}
			cse4589_print_and_log("[%s:END]\n", "REFRESH");
			free(buffer);
		}
		else if(starts_with(cmd, "EXIT")){
			cse4589_print_and_log("[%s:SUCCESS]\n", "EXIT");
			int close_ret = close(server);
			cse4589_print_and_log("[%s:END]\n", "EXIT");
			exit(0);
		}
		char *buffer = (char*) malloc(sizeof(char)*BUFFER_SIZE);
		fflush(stdout);
		free(buffer);
	}	
}



int main(int argc, char **argv)
{
	/*Init. Logger*/
	cse4589_init_log(argv[2]);

	/* Clear LOGFILE*/
    fclose(fopen(LOGFILE, "w"));

	/*Start Here*/
	memset(client_side_server_output, '\0', sizeof(client_side_server_output));
	
	if(argc < 2){
		return 0;
	} 

	if(strcmp(argv[1], "s") == 0){
		start_server(argv[2]);
	}
	if(strcmp(argv[1],"c")==0 ){
		start_client_modified(argv[2]);
	}

	return 0;
}




// refernces strtok, 